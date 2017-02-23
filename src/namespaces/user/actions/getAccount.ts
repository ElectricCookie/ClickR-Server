
import Authenticate from "../middleware/authenticate";
import userSchema from "../userSchema";
import {Action, WebAction, HttpMethod, ObjectSchema, ObjectMode, StringSchema} from "floodway";
export default class GetAccount extends WebAction{


    getUrl(){
        return "/account"
    }

    getHttpMethods(){
        return [HttpMethod.GET]
    }

    getWebMetaData(){
        return{
            name: "getAccount",
            description: "Get the account information of the current user",
            errors: [],
            middleware: [new Authenticate({ provideUser: true })],
            params: new ObjectSchema("GetAccountParamsPopulated").children({
                user: userSchema.getGroup("db")
            }),
            exposeParams: new ObjectSchema("GetAccountParams").children({
            }),
            result: userSchema.getGroup("profile").mode(ObjectMode.SHORTEN)
        }
    }

    run(){
        this.res(this.params.user)
    }



}