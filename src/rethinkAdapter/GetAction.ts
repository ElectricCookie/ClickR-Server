import * as r from "rethinkdb";
import {
    Action, ObjectSchema, Middleware, WebAction, StringSchema, ObjectMode, HttpMethod,
    ArraySchema
} from "floodway/dist/__entry";
import {RestBase} from "./RestBase";
export abstract class GetAction extends RestBase{


    abstract getOutputSchema(): ObjectSchema;


    getUrl(){
        return this.getPath()+"/:id"
    }

    getHttpMethods(){
        return [HttpMethod.GET]
    }

    getSchema(){
        return null;
    }

    getFilter(){
        return {id: this.params.id};
    }


    getWebMetaData(){
        return {
            name: "get",
            description: "Get an item from the database",
            errors: [{ errorCode: "notFound", description: "The item specified was not found" }],
            supportsUpdates: false,
            middleware: this.getMiddleware(),
            params: new ObjectSchema("IdContainer").children({
                id: new StringSchema().length(36)
            }),
            result: this.getOutputSchema().mode(ObjectMode.SHORTEN),
        }
    }



    run(){

        this.getDb((db) => {
            r.table(this.getTable()).filter(this.getFilter()).run(db,(err,cursor) => {
                if(err != null){ return this.fail("internalError",err) }
                cursor.toArray((err,items) => {
                    if(err != null){ return this.fail("internalError",err) }

                    if(items.length != 1){ return this.fail("notFound") }
                    console.log("Fetched single item",items[0]);
                    this.res(items[0]);
                })

            })
        });

    }
}