
import Authenticate from "../middleware/authenticate";
import userSchema from "../userSchema";
import {Action, WebAction, HttpMethod, ObjectSchema, ObjectMode, StringSchema} from "floodway";
import {AutoPopulate} from "../../../autoPopulate";
export default class GetProfile extends WebAction{

    getUrl(){
        return "/profile/:user"
    }

    getHttpMethods(){
        return [HttpMethod.GET]
    }

    getWebMetaData(){
        return{
            name: "getProfile",
            description: "Get the public information of the user",
            errors: [],
            middleware: [new AutoPopulate({
                table: "users",
                key: "user",
                isArray: false,
                checkOnly: false,
                getFilter: (action) => { return {}; }
            })],
            params: new ObjectSchema("GetProfileParamsPopulated").children({
                user: userSchema.getGroup("db")
            }),
            exposeParams: new ObjectSchema("GetProfileParams").children({
                user: new StringSchema().length(36)
            }),
            result: userSchema.getGroup("public").mode(ObjectMode.SHORTEN)
        }
    }

    run(){
        this.res(this.params.user)
    }



}