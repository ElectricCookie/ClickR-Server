import * as r from "rethinkdb";
import {
    Action, ObjectSchema, Middleware, WebAction, StringSchema, ObjectMode, HttpMethod,
    ArraySchema
} from "floodway/dist/__entry";
import {RestBase} from "./RestBase";

export abstract class CreateAction extends RestBase{

    getUrl(){
        return this.getPath()
    }

    getHttpMethods(){
        return [HttpMethod.POST];
    }

    getWebMetaData(){
        return {
            name: "create",
            description: "Creates a new item in the database",
            errors: [],
            supportsUpdates: false,
            middleware: this.getMiddleware(),
            params: this.getSchema(),
            result: new ObjectSchema("IdContainer").children({
                id: new StringSchema().length(36)
            })
        }
    }

    getDefaults(){
        return {};
    }

    run(){
        this.getDb((db: r.Connection) => {
            r.table(this.getTable()).insert((<any>Object).assign(this.getDefaults(),this.params)).run(db,(err,res) => {
                if(err != null){ return this.fail("internalError",err) }
                this.res({
                    id: res.generated_keys[0]
                });
            });
        });
    }

}