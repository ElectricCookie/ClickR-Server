import {ObjectSchema, StringSchema, Action} from "floodway";
import Throttle from "../../../throttle";
import * as Utils from "../utils";
import *  as request from "superagent";
import DbConnector from "../../../dbConnector";
import * as r from "rethinkdb";
export default class AuthenticateGoogle extends Action {


    getMetaData() {
        return {
            name: "authenticateGoogle",
            description: "Logs in via Google or Stores data for registration via Google.",
            errors: [
                {errorCode: "invalidToken", description: "The token passed is invalid"},
                {errorCode: "notExistent", description: "No user registered with this Google-ID. Info was stored."}
            ],
            middleware: [new Throttle("authenticateGoogle", 10)],
            supportsUpdates: false,
            params: new ObjectSchema("AuthenticateGoogleParams").children({
                token: new StringSchema()
            }),
            result: new ObjectSchema("NoResult").children({})
        }
    }

    authenticate(id) {
        let key = "user:" + this.sessionId;
        this.redis.set(key, id, (err) => {
            // Make sure that the session has been saved
            if (err != null) {
                return this.fail("internalError")
            }
            // Empty but happy!
            this.res({});
        });
    }


    run(){

        request.get("https://www.googleapis.com/oauth2/v3/tokeninfo").query({
            id_token: this.params.token
        })
            .set('Accept', 'application/json')
            .end((err,res) => {

                if (err == null) {

                    let data = res.body;

                    DbConnector.getDb((db) => {
                        r.table(Utils.TABLE_NAME).filter({
                            providerId: data.sub,
                            provider: "google"
                        }).run(db, (err, cursor) => {
                            if (err != null) {
                                return this.fail("internalError", err)
                            }

                            cursor.toArray((err, res) => {
                                if (err != null) {
                                    return this.fail("internalError", err)
                                }

                                if (res.length == 1) {
                                    this.authenticate(res[0].id);
                                } else {


                                    this.redis.hmset(this.sessionId+":googleInfo",{

                                        email: data.email,
                                        id: data.sub,
                                        fullName: data.name,
                                        picture: data.picture

                                    },(err) => {


                                        return this.fail("notExistent");
                                    });

                                }
                            })
                        })
                    })
                }
            })

    }

}