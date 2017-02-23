
import DbConnector from "../../../dbConnector";
import *  as r from "rethinkdb";
import *  as Utils from "../utils";
import {Middleware, ObjectSchema, ObjectMode, Action} from "floodway";

export interface AuthenticateParams{
    provideUser?: boolean;
    provideUserId?: boolean;
    userKey?: string;
    userIdKey?: string;
    checkGroup?: string[];
}

export default class  Authenticate extends Middleware{

    private params: AuthenticateParams;

    constructor(params: AuthenticateParams){
        super();

        this.params = {
            provideUser: params.provideUser != null ? params.provideUser : false,
            provideUserId: params.provideUserId != null ? params.provideUserId : false,
            userKey: params.userKey != null ? params.userKey: "user",
            userIdKey: params.userIdKey != null ? params.userIdKey: "userId",
            checkGroup: params.checkGroup

        }
    }

    getMetaData(){
        return {
            name: "authenticate",
            description: "Authenticate a user. Can also provide the user as parameter to the action. checking the DB for the user is optional",
            errors: [
                { errorCode: "notLoggedIn", description: "You do not have access to this action." },
                { errorCode: "notEnoughPermissions", description: "The user doesnt have the required groups to perform this action" }
            ],
            params: new ObjectSchema("AuthenticateParams").mode(ObjectMode.LOOSE)
        }
    }

    run(action: Action){

        if(action.sessionId != null){

                action.redis.get("user:"+action.sessionId,(err,res) => {

                    if(err != null){ return this.fail("internalError",{ occuredAt: "authenticate" }) }


                    if( res != null && res.length == 36){
                        // Authenticated.

                        if(this.params.provideUserId){
                            action.params[this.params.userIdKey] = res;
                        }

                        if(this.params.provideUser ||  this.params.checkGroup != null){

                            DbConnector.getDb((db: r.Connection) =>{

                                r.table(Utils.TABLE_NAME).filter({ id:  res }).run(db,(err, res) => {
                                    if(err != null){ return this.fail("internalError",{ occuredAt: "authenticate" }) }

                                    res.toArray((err,res) => {
                                        if(res.length == 1){
                                            if(this.params.provideUser){

                                                action.params[this.params.userKey] = res[0];


                                            }

                                            if(this.params.checkGroup != null){

                                                for(let group of this.params.checkGroup){

                                                    if(res[0].groups.indexOf(group) == -1){
                                                        this.fail("notEnoughPermissions",{ missingGroup: group });
                                                        break;
                                                    }

                                                }

                                                this.next();

                                            }else{
                                                this.next();
                                            }


                                        }else{
                                            this.fail("notLoggedIn",action)
                                        }
                                    })

                                });

                            });

                        }else{
                            this.next();
                        }

                    }else{
                        this.fail("notLoggedIn",action);
                    }

                })
        }else{
            this.fail("notLoggedIn",action);
        }

    }

}