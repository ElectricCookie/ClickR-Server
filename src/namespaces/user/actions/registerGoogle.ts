import * as request from "superagent";
import * as r from "rethinkdb";
import {Action, ObjectSchema, StringSchema} from "floodway";
import Throttle from "../../../throttle";
import * as Utils from "../utils";
import DbConnector from "../../../dbConnector";
import {db} from "rethinkdb";
import CheckUsername from "./checkUsername";

export default class RegisterGoogle extends Action{


    getMetaData(){
        return {
            name: "registerGoogle",
            description: "Logs in via Google or Registers via Google.",
            errors: [
                { errorCode: "invalidToken", description: "The token passed is invalid"},
                { errorCode: "usernameTaken", description: "The username chosen is already taken" }
            ],
            middleware: [new Throttle("registerGoogle",10)],
            supportsUpdates: false,
            params: new ObjectSchema("RegisterGoogleParams").children({
                username: new StringSchema().minLength(2).maxLength(32),
                password: new StringSchema().minLength(5)
            }),
            result: new ObjectSchema("NoResult").children({})
        }
    }

    authenticate(id){
        let key = "user:"+this.sessionId;
        this.redis.set(key,id,(err) => {
            // Make sure that the session has been saved
            if(err != null){ return this.fail("internalError") }
            // Empty but happy!
            this.res({

            });
        });
    }


    run(){


        // Make sure passwords match



        CheckUsername.checkUsername(this.params.username,(err) => {

            if(err != null){ return this.fail(err);}

            this.redis.hgetall(this.sessionId+":googleInfo",(err,googleInfo) => {

                if(err != null){ return this.fail("internalError",err) }

                if(googleInfo == null){
                    this.fail("noTokenSet");
                }else{
                    DbConnector.getDb((db) => {

                        let salt = Utils.getRandomHash();
                        let password = this.params.password;

                        Utils.digestPassword(password,salt,(err,passwordHash) => {

                            r.table(Utils.TABLE_NAME).insert({
                                username: this.params.username,
                                password: passwordHash,
                                salt: salt,
                                email: googleInfo.email,
                                avatar: googleInfo.picture,
                                fullName: googleInfo.fullName,
                                activated: true,
                                groups: [],
                                provider: "google",
                                providerId: googleInfo.id,
                                activationToken: "inactive",
                                resetPasswordToken: "inactive",
                                resetPasswordTokenExpires: 0,
                                registered: Date.now(),
                                lastSeen: Date.now(),
                                isAdmin: false,
                                bio: ""
                            }).run(db,(err,writeRes) => {

                                this.redis.del(this.sessionId+":googleInfo",(err) => {
                                    this.authenticate(writeRes.generated_keys[0]);
                                });


                            })
                        });

                    });


                }

            });


        });




    }

}