import {Action, ObjectSchema, ArraySchema, StringSchema} from "floodway";
import schema from "../schema";
import * as r from "rethinkdb";
import Authenticate from "../../user/middleware/authenticate";
import DbConnector from "../../../dbConnector";
export default class ListSessions extends Action{


    getMetaData(){
        return {
            name: "listSessions",
            description: "Get all session the current user is participating in",
            middleware: [new Authenticate({ provideUserId: true })],
            supportsUpdates: false,
            errors: [],
            params: new ObjectSchema("ListSessionsParamsPopulated").children({
                userId: new StringSchema().length(36)
            }),
            exposeParams: new ObjectSchema("ListSessionsParams").children({

            }),
            result: new ObjectSchema("ListSessionsResult").children({
                items: new ArraySchema().child(schema.getGroup("ScenarioSession"))
            })
        }
    }


    run(){
        DbConnector.getDb((db) => {
            r.table("scenarioSessions").filter({ user: this.params.userId }).run(db,(err,cursor) => {

                if(err != null){ return this.fail("internalError",err) }

                cursor.toArray((err,items) => {

                    if(err != null){ return this.fail("internalError",err) }


                    this.res({
                        items: items.filter((item) => {
                            let done = true;
                            item.tracks.map((item)  => {
                                if(!item.played){
                                    done = false;
                                }
                            });
                            return !done;
                        })
                    })

                });
            });
        });


    }
}