import {WebAction, HttpMethod, ObjectSchema, StringSchema, AsyncGroup} from "floodway";
import userSchema from "../../user/userSchema";
import testScenarioSchema from "../../testScenarios/schema";
import {AutoPopulate} from "../../../autoPopulate";
import * as r from "rethinkdb";
import Authenticate from "../../user/middleware/authenticate";
import DbConnector from "../../../dbConnector";
export default class GenerateSession extends WebAction {


    getUrl() {
        return "/session/new"
    }

    getHttpMethods() {
        return [HttpMethod.POST]
    }

    getWebMetaData() {
        return {
            name: "generateSession",
            description: "creates a new Session",
            errors: [],
            middleware: [new AutoPopulate({
                key: "scenarioId",
                outKey: "scenario",
                table: "testScenarios",
                getFilter: () => {
                    return r.row("tracks").count().gt(0)
                },
                checkOnly: false,
                isArray: false
            }), new Authenticate({
                provideUserId: true
            })],
            params: new ObjectSchema("GenerateSessionParamsPopulated").children({
                userId: new StringSchema().length(36),
                scenario: testScenarioSchema.getGroup("db"),

            }),
            exposeParams: new ObjectSchema("GenerateSessionParams").children({
                scenarioId: new StringSchema().length(36),

            }),
            result: new ObjectSchema("GenerateSessionResult").children({
                id: new StringSchema().length(36)
            })
        }
    }

    run() {
        DbConnector.getDb((db) => {
            r.table("scenarioSessions").insert({
                created: Date.now(),
                lastUpdated: Date.now(),
                user: this.params.userId,
                scenario: this.params.scenario.id,
                title: this.params.scenario.title,
                description: this.params.scenario.description,
                tracks: this.params.scenario.tracks.map((item) => {
                    return {
                        trackId: item,
                        played: false,
                        offset: 0
                    }
                })

            }).run(db, (err, ops) => {
                if (err != null) {
                    return this.fail("internalError", err)
                }

                this.res({
                    id: ops.generated_keys[0]
                });

            });
        });


    }


}