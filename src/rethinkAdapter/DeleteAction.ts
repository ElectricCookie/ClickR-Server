import * as r from "rethinkdb";
import {
    Action, ObjectSchema, Middleware, WebAction, StringSchema, ObjectMode, HttpMethod,
    ArraySchema
} from "floodway";
import {RestBase} from "./RestBase";


export abstract class DeleteAction extends RestBase{

    abstract getDb(callback:{ (db:r.Connection) })

    public abstract getItemName(): string;

    public getSchema(){
        return null;
    }

    public makeClassName(input: string){
        return input.charAt(0).toUpperCase()+input.slice(1)
    }


    getHttpMethods(){
        return [HttpMethod.DELETE];
    }

    getWebMetaData(){
        return{
            name: "delete",
            description: "Deletes a "+this.getItemName(),
            errors: [{ errorCode: "notFound", description: "The specified item was not found" }],
            middleware: this.getMiddleware(),
            params: new ObjectSchema("IdContainer").children({
                id: new StringSchema().length(36)
            }),
            result: new ObjectSchema("EmptyResult").children({})
        }
    }

    run(){
        this.getDb((db) => {
            console.log(this.getTable(),this.params.id);
            r.table(this.getTable()).get(this.params.id).delete().run(db,(err,res) => {
                if(err != null || res.deleted == 0){ return this.fail("notFound") }

                this.res({});

            })
        });
    }

}