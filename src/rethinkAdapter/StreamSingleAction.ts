import {CrudBase} from "./RestBase";
import {ObjectSchema, Type, StringSchema, Middleware} from "floodway";
import *  as r from "rethinkdb";
export abstract class StreamSingleAction extends CrudBase{

    abstract getOutputSchema(): ObjectSchema;

    getFilter(): any{
        return {};
    }

    getSchema(){
        return null;
    }


    getName(){
        return "stream";
    }

    getMetaData(){
        return {
            name: this.getName(),
            description: "Stream an item from the DB",
            errors: [{errorCode: "valueRemoved", description: "The document was removed"}],
            supportsUpdates: true,
            middleware: this.getMiddleware(),
            params: this.getParams(),
            result: this.getOutputSchema(),
        }
    }

    getParams(): Type{
        return new ObjectSchema("StreamSingleParams").children({
            id: new StringSchema().length(36)
        })
    }

    run(){


        this.getDb((db: r.Connection) => {


            r.table(this.getTable()).get(this.params.id).changes({ includeInitial: true }).run(db,(err,cursor) => {
                if(err != null){ return this.fail("internalError",err) }

                cursor.each((err, ev) => {
                    if(err != null){ return this.fail("internalError",err) }
                    if(ev.new_val != null){
                        this.res(ev.new_val)
                    }else{
                        this.fail("valueRemoved")
                    }
                });

                this.once("done",() => {
                    cursor.close();
                })
            });
        });
    }

}