import * as r from "rethinkdb";
import {
    Action, ObjectSchema, Middleware, WebAction, StringSchema, ObjectMode, HttpMethod,
    ArraySchema
} from "floodway/dist/__entry";
import {RestBase} from "./RestBase";


export abstract class GetAllAction extends RestBase{

    abstract getOutputSchema(): ObjectSchema;

    getFilter(): any{
        return {};
    }

    getSchema(){
        return null;
    }

    getUrl(){
        return this.getPath()+"/"
    }

    getHttpMethods(){
        return [HttpMethod.GET];
    }

    getWebMetaData(){
        return {
            name: "getAll"+this.getItemNamePlural(),
            description: "Get all items from the database",
            errors: [],
            supportsUpdates: false,
            middleware: this.getMiddleware(),
            params: new ObjectSchema("NoParams").children({}),
            result: new ObjectSchema("ResultEnvelope").children({items: new ArraySchema().child(this.getOutputSchema().mode(ObjectMode.PARTIAL))})
        }
    }

    run(){
        this.getDb((db: r.Connection) => {
            r.table(this.getTable()).filter(this.getFilter).run(db,(err,cursor) => {
                if(err != null){ return this.fail("internalError",err) }
                cursor.toArray((err,items) => {
                    if(err != null){ return this.fail("internalError",err) }
                    this.res(items);
                });
            });
        });
    }
}