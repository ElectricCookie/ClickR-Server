import { ObjectSchema, StringSchema, ArraySchema, HttpMethod, WebAction} from "floodway";
import Authenticate from "../../user/middleware/authenticate";
import schema from "../schema";
import DbConnector from "../../../dbConnector";
import *  as r from "rethinkdb";
import {StreamAllAction} from "../../../rethinkAdapter/StreamAllAction";
export default class GetOpenScenarios extends WebAction{


    getUrl(){
        return "/testScenarios/open"
    }

    getHttpMethods(){
        return [HttpMethod.GET]
    }




    getWebMetaData(){
        return {
            name: "getOpenScenarios",
            description: "Get a list of scenarios the user could join",
            exposeParams: new ObjectSchema("GetOpenScenariosParams").children({}),
            params: new ObjectSchema("GetOpenScenariosParamsPopulated").children({
                userId: new StringSchema().length(36)
            }),
            middleware: [new Authenticate({
                provideUserId: true
            })],
            errors: [],
            result: new ObjectSchema("GetOpenScenariosResult").children({
                openScenarios: new ArraySchema().child(schema.getGroup("TestScenario"))
            }),

        }
    }

    run(){
        DbConnector.getDb((db) => {

            r.table("testScenarios").filter((row) =>{
                return row("tracks")
                    .count().gt(0)
                    .and(
                        row("invitedProbands").contains(this.params.userId).or(
                            row("isPrivate").not()
                        )
                    )
                    .and(
                        r.table("scenarioSessions")
                            .filter({ user: this.params.userId, scenario: row("id") })
                            .count().eq(0)
                    )
            }).run(db,(err,cursor) => {

                if(err != null){ return this.fail("internalError") }

                cursor.toArray((err,items) => {

                    if(err != null){ return this.fail("internalError") }

                    this.res({
                        openScenarios: items
                    })

                });


            })

        })


    }




}