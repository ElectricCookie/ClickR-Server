
import Throttle from "../../../throttle";
import userSchema from "../userSchema";
import * as Utils from "../utils";
import * as r from "rethinkdb";
import DbConnector from "../../../dbConnector";
import {Action, WebAction, HttpMethod, ObjectSchema} from "floodway";
export default class Register extends WebAction{


    getUrl(){
        return "/register"
    }

    getHttpMethods(){
        return [HttpMethod.POST]
    }

    getWebMetaData(){
        return{
            name: "register",
            description: "Creates a new user object in database",
            params: userSchema.getGroup("register"),
            result: new ObjectSchema("NoResult").children({}),
            errors: [
                { errorCode: "usernameTaken", description: "The username you\'re trying to use is already taken" },
                { errorCode: "emailTaken", description: "The email you\'re trying to use is already used for another account" },
            ],
            middleware: [new Throttle("register",3)] // One attempt every 3 seconds.
        }
    }

    run(){



        // Make sure neither email nor username exist in the database
        DbConnector.getDb((db) => {
            r.table(Utils.TABLE_NAME)
                .filter(
                    r.row("username").eq(this.params.username)
                        .or(r.row("email").eq(this.params.email)
                        )
                ).run(db,(err,cursor) => {
                if(err != null){ return this.fail("internalError") }
                cursor.toArray((err,result) => {
                    if(err != null){ return this.fail("internalError") }
                    if(result.length != 0 ){
                        if(result[0].email == this.params.email){
                            return this.fail("emailTaken");
                        }else{
                            return this.fail("usernameTaken")
                        }
                    }else{

                        let salt = Utils.getRandomHash();
                        let activationToken = Utils.getRandomHash();
                        let gravatar = Utils.md5(this.params.email);

                        Utils.digestPassword(this.params.passwordInput,salt,(err,passwordHash) => {

                            r.table(Utils.TABLE_NAME).insert({
                                username: this.params.username,
                                password: passwordHash,
                                salt: salt,
                                email: this.params.email,
                                avatar: "https://gravatar.com/avatar/"+gravatar,
                                fullName: this.params.fullName,
                                activated: false,
                                provider: "local",
                                providerId: "none",
                                groups: [],
                                activationToken: activationToken,
                                resetPasswordToken: "inactive",
                                resetPasswordTokenExpires: 0,
                                registered: Date.now(),
                                lastSeen: Date.now(),
                                isAdmin: false,
                                bio: ""
                            }).run(db,(err,result) => {

                                if(err != null){ return this.fail("internalError") }

                                this.res({
                                    newId: result.generated_keys[0]
                                });

                            });

                        });



                    }
                })
            })
        });




    }


}