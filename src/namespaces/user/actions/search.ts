import {Action, WebAction, HttpMethod, ObjectSchema, StringSchema, ArraySchema, ObjectMode} from "floodway";
import DbConnector from "../../../dbConnector";
import userSchema from "../userSchema";
import * as r from "rethinkdb";
import * as Utils from "../utils";
import Authenticate from "../middleware/authenticate";

export default class Search extends WebAction{


    getUrl(){
        return "/search/:query"
    }

    getHttpMethods(){
        return [HttpMethod.GET]
    }


    getWebMetaData(){
        return {
            name: "search",
            description: "Search for a user in the database",
            params: new ObjectSchema("SearchParams").children({
                query: new StringSchema().trim(true)
            }),
            result: new ObjectSchema("SearchResult").children({
                items: new ArraySchema().child(userSchema.getGroup("public").mode(ObjectMode.SHORTEN))
            }),
            errors: [],
            middleware: [new Authenticate({})]
        }
    }

    run(){

        DbConnector.getDb((db) => {
            r.table(Utils.TABLE_NAME).filter(
                r.row("fullName").match(this.params.query)
                    .or(r.row("username").match(this.params.query))
            ).run(db,(err,res) =>{
                if(err != null || res == null){ return this.fail("internalError",err) }
                res.toArray((err,items) => {
                    if(err != null || res == null){ return this.fail("internalError",err) }

                    this.res({
                        items: items
                    });
                })
            })
        });
    }
}