
import * as r from "rethinkdb";
import {
    Action, ObjectSchema, Middleware, WebAction, StringSchema, ObjectMode, HttpMethod,
    ArraySchema
} from "floodway/dist/__entry";



export abstract class CrudBase extends Action{

    abstract getItemName():string;

    abstract getSchema(): ObjectSchema;

    abstract getDb(callback:{ (db:r.Connection) })

    getMiddleware(): Middleware[]{
        return []
    }

    getItemNamePlural():string {
        return this.getItemName() + "s"
    }

    getTable():string {
        return this.getItemNamePlural();
    }

    getPath():string {
        return "/" + this.getItemName();
    }

}

export abstract class RestBase extends WebAction{


    abstract getItemName():string;

    abstract getSchema(): ObjectSchema;

    abstract getDb(callback:{ (db:r.Connection) })

    getMiddleware(): Middleware[]{
        return []
    }

    getItemNamePlural():string {
        return this.getItemName() + "s"
    }

    getTable():string {
        return this.getItemNamePlural();
    }

    getPath():string {
        return "/" + this.getItemName();
    }

}






