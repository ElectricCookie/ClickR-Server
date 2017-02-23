

import { pbkdf2 } from "crypto";
import DbConnector from "../../../dbConnector";
import * as Utils from "../utils";
import * as r from "rethinkdb";
import schema from "../userSchema";
import Throttle from "../../../throttle";
import {Action, WebAction, ObjectSchema, HttpMethod, StringSchema} from "floodway";

export default class Login extends WebAction{


    getHttpMethods(){
        return [HttpMethod.POST];
    }

    getUrl(){
        return "/login"
    }


    getWebMetaData(){
        return{
            name: "login",
            description: "Logs a user into an account",
            params: schema.getGroup("login"),
            middleware: [new Throttle("login",3)],
            supportsUpdates: false,
            result: new ObjectSchema("EmptyResult").children({
               // Maybe later something here
            }),
            errors: [{ errorCode: "loginLocked", description: "Stop spamming" },{ errorCode: "invalidLogin", description: "Username or password is wrong" }]
        }
    }

    run(){
        DbConnector.getDb((db : r.Connection) => {
            setTimeout(() => {
                console.log("Logging in");
                // Get user by username
                r.table(Utils.TABLE_NAME).filter({
                    username: this.params.username
                }).run(db,(err,cursor) => {
                    // Check if there are errors
                    if(err != null){ return this.fail("internalError") }
                    cursor.toArray((err,result) => {
                        // Check again for errors
                        if(err != null) { return this.fail("internalError") }
                        // Check if we only have 1 user
                        if(result.length == 1){
                            // Get the user
                            let user = result[0];

                            // Calculate the password hash
                            pbkdf2(this.params.passwordInput,user.salt, 100000, 512, 'sha512', (err, key) => {
                                // Make sure there are no errors while calculating the hash
                                if(err != null){  this.fail("internalError") }

                                // Match hash and stored password hash
                                if(user.password == key.toString("hex")){

                                    // Set the user token in redis
                                    let key = "user:"+this.sessionId;
                                    this.redis.set(key,user.id,(err) => {

                                        // Make sure that the session has been saved
                                        if(err != null){ return this.fail("internalError") }

                                        // Empty but happy!
                                        this.res({

                                        });
                                    });

                                }else{
                                    return this.fail("invalidLogin");
                                }
                            });

                        }else{
                            return this.fail("invalidLogin")
                        }
                    });
                })


            },2000)

        })

    }
}