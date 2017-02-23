import {WebAction, HttpMethod, ObjectSchema, StringSchema, BooleanSchema} from "floodway";
import DbConnector from "../../../dbConnector";
import * as Utils from "../utils";
import * as r from "rethinkdb";
export default class CheckUsername extends WebAction{


    getHttpMethods(){
        return [HttpMethod.GET]
    }

    getUrl(){
        return "/checkUsername/:username"
    }

    getWebMetaData(){
        return {
            name: "checkUsername",
            description: "Checks if a username is taken",
            errors: [{ errorCode: "usernameTaken", description: "The username you chose is already taken" }],
            middleware: [],
            params: new ObjectSchema("CheckUsernameParams").children({
                username: new StringSchema().minLength(2).toLowerCase()
            }),
            result: new ObjectSchema("CheckUsernameResult").children({
                isTaken: new BooleanSchema()
            })
        }
    }

     static checkUsername(username,callback: { (err: any) }) {

        DbConnector.getDb((db) => {
            r.table(Utils.TABLE_NAME).filter(r.row("username").downcase().eq(username.toLowerCase())).count().run(db,(err,count) => {
                if(err != null){
                    console.log(err);
                    callback("internalError");
                }else{
                    if(count == 0){
                        callback(null);
                    }else{
                        callback("usernameTaken");
                    }
                }
            });
        });
    }

    run(){
        CheckUsername.checkUsername(this.params.username,(err) => {
            if(err != null){ return this.fail(err) }

            this.res({
                isTaken: false
            });

        });
    }


}