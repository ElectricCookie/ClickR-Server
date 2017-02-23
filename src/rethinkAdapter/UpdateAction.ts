import * as r from "rethinkdb";
import {
    ObjectSchema, HttpMethod, ObjectMode, StringSchema, Middleware

} from "floodway";
import {RestBase} from "./RestBase";

export abstract class UpdateAction extends RestBase{

    getWebMetaData(){
        return {
            name: "update",
            description: "Update an item in the database",
            errors: [],
            middleware: this.getMiddleware(),
            params: new ObjectSchema("UpdateParams").children({
                item: this.getSchema().mode(ObjectMode.PARTIAL),
                id: new StringSchema().length(36)
            }),
            result: new ObjectSchema("EmptyResult").children({}),
        }
    }

    getUrl(){
        return this.getPath()+"/:id"
    }

    getHttpMethods(){
        return [HttpMethod.PATCH];
    }

    run(){

        this.getDb((db: r.Connection) => {
            r.table(this.getTable()).filter({ id: this.params.id }).update(this.params.item).run(db,(err,res) => {
                if(err != null){ return this.fail("internalError",err) }
                this.res({
                    updated: res.replaced
                });
            })
        })

    }

}