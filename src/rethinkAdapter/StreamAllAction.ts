import * as r from "rethinkdb";
import {
    Action, ObjectSchema, Middleware, WebAction, StringSchema, ObjectMode, HttpMethod,
    ArraySchema, Type
} from "floodway/dist/__entry";

import {CrudBase} from "./RestBase";

export abstract class StreamAllAction extends CrudBase{

    abstract getOutputSchema(): ObjectSchema;

    getFilter(): any{
        return {};
    }

    getSchema(){
        return null;
    }


    getName(){
        return "streamAll";
    }

    getMetaData(){
        return {
            name: this.getName(),
            description: "Get all items from the database",
            errors: [],
            supportsUpdates: true,
            middleware: this.getMiddleware(),
            params: this.getParams(),
            result: new ObjectSchema("StreamResult").mode(ObjectMode.PARTIAL).children({
                type: new StringSchema().oneOf(["value","removed","initial"]),
                id: new StringSchema().length(36),
                value: this.getOutputSchema(),
                values: new ArraySchema().child(this.getOutputSchema())
            }),
        }
    }

    getParams(): Type{
        return new ObjectSchema("NoParams").children({})
    }

    run(){


        this.getDb((db: r.Connection) => {

            r.table(this.getTable()).filter(this.getFilter()).run(db,(err,cursor) => {

                if(err != null){ return this.fail("internalError",err) }

                cursor.toArray((err,items) => {
                    if(err != null){ return this.fail("internalError",err) }
                    this.res({
                        type: "initial",
                        values: items
                    })
                });


            });

            r.table(this.getTable()).filter(this.getFilter()).changes().run(db,(err,cursor) => {
                if(err != null){ return this.fail("internalError",err) }


                cursor.each((err, ev) => {
                    if(err != null){ return this.fail("internalError",err) }
                    if(ev.new_val != null){
                        this.res({
                            type: "value",
                            id: ev.new_val.id,
                            value: ev.new_val
                        })
                    }else{
                        this.res({
                            type: "removed",
                            id: ev.old_val.id,
                        })
                    }
                });

                this.once("done",() => {
                    cursor.close();
                })
            });
        });
    }
}
