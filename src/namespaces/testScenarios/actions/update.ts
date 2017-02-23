import DbConnector from "../../../dbConnector";
import {UpdateAction} from "../../../rethinkAdapter/UpdateAction";
import schema from "../schema";
import * as r from "rethinkdb";
import {AutoPopulate} from "../../../autoPopulate";
import {ObjectSchema, Middleware, ObjectMode, Action} from "floodway";

export class CheckUsers extends Middleware{


    getMetaData(){
        return {
            name: "CheckUsers",
            description: "Make sure the users passed exist",
            params: new ObjectSchema("CheckUsersParams").children({
                item: schema.getGroup("update")
            }).mode(ObjectMode.LOOSE),
            errors: [{ errorCode: "notFound", description: "A userId passed to this action doesn\'t exist" }]
        }
    }

    run(action: Action){
        DbConnector.getDb((db) => {

            let keys  = action.params.item.sharedWith.concat(action.params.item.invitedProbands);

            r.table("users")
                .getAll(
                    r.args(keys)
                ).run(db,(err,cursor) => {
                if(err != null){ return this.fail("internalError",err) }

                cursor.toArray((err,items) => {
                    if(err != null){ return this.fail("internalError",err) }
                    if(items.length != keys.length){
                        return this.fail("notFoundItem")
                    }
                    this.next();
                })

            });

        })
    }

}

export default class Update extends UpdateAction{


    getDb(callback){
        DbConnector.getDb(callback);
    }

    getTable(){
        return "testScenarios"
    }

    getItemName(){
        return "TestScenario"
    }

    getSchema(){
        return schema.getGroup("update")
    }

    getMiddleware(){
        return [new CheckUsers()]
    }

}