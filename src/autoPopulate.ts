import {Middleware, StringSchema, ObjectSchema, ObjectMode, Action, Type, ArrayMode, ArraySchema} from "floodway";
import DbConnector from "./dbConnector";
import * as r from "rethinkdb";
import * as _ from "lodash";


export interface AutoPopulateParams {
    key: string;
    table: string;
    getFilter?: { (action: Action): any };
    checkOnly: boolean;
    isArray: boolean;
    arrayMode?: string;
    outKey?: string;
}
export class AutoPopulate extends Middleware{

    private params: AutoPopulateParams;

    constructor(params: AutoPopulateParams){
        super();

        params.arrayMode = params.arrayMode != null ? params.arrayMode : "strict";
        params.outKey = params.outKey != null ? params.outKey : params.key;
        params.getFilter = params.getFilter != null ? params.getFilter : () => { return {} };


        this.params = params;



    }


    getMetaData(){


        let keys: { [path:string]:Type } = {};

        if(this.params.isArray){
            keys[this.params.key] = new ArraySchema().child(new StringSchema().length(36));
        }else{
            keys[this.params.key] = new StringSchema().length(36);
        }

        return {
            name: "autoPopulate",
            description: "Populates an item from the database",
            params: new ObjectSchema("CheckKey").children(keys).mode(ObjectMode.LOOSE),
            errors: [
                { errorCode: "notFound", description: "The property "+this.params.key+" could not be found in the database" },
                { errorCode: "notFoundItem", description: "The property "+this.params.key+" contains an item that could not be found in the database" },
            ]
        }
    }


    run(action: Action){
        DbConnector.getDb((db) => {


            // Check what we're dealing with
            if(this.params.isArray){


                r.table(this.params.table).getAll(r.args(action.params[this.params.key])).filter(this.params.getFilter(action)).run(db,(err,cursor) => {
                    if(err != null){ return this.fail("internalError",err) }

                    cursor.toArray((err,items) => {
                        if(err != null){ return this.fail("internalError",err) }
                        if(this.params.arrayMode != "shorten" && items.length != action.params[this.params.key].length){
                            return this.fail("notFoundItem")
                        }

                        if(!this.params.checkOnly){
                            action.params[this.params.outKey] = items;
                        }

                    })

                });


            }else{

                let filter = this.params.getFilter(action);



                r.table(this.params.table).filter(filter).filter({id: action.params[this.params.key]}).run(db,(err,cursor) => {
                    if(err != null){ return this.fail("internalError",err) }

                    cursor.toArray((err,items) => {
                        if(err != null){ return this.fail("internalError",err) }

                        if(items == null || items.length == 0){
                            return this.fail("notFound")
                        }else{
                            if(!this.params.checkOnly){
                                action.params[this.params.outKey] = items[0];
                            }

                            this.next();
                        }

                    });

                });

            }



        });



    }
}


/*

 if(this.params.filter != null){

 this.params.filter.id = action.params[this.key];

 r.table(this.table).filter(this.filter).run(db,(err,cursor) => {
 if(err != null){ return this.fail("internalError",err) }
 cursor.toArray((err,items) => {
 if(items.length == 0){ return this.fail("notFound") }
 action.params[this.key] = items[0];
 this.next();
 });

 })

 }else{
 r.table(this.table).get(action.params[this.key]).run(db,(err,item) => {
 if(err != null){ return this.fail("internalError",err) }
 if(item == null){ return this.fail("notFound") }
 action.params[this.key] = item;
 this.next();
 })
 }

 */