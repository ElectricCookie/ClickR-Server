import DbConnector from "../../../dbConnector";
import {ObjectSchema} from "floodway";
import schema from "../schema";
import {CreateAction} from "../../../rethinkAdapter/CreateAction";
import Authenticate from "../../user/middleware/authenticate";

export default class Create extends CreateAction{

    getDb(cb){
        DbConnector.getDb(cb);
    }

    getItemName(){
        return "testScenario"
    }

    getSchema(){
        return schema.getGroup("create");
    }

    getMiddleware(){
        return [new Authenticate({ provideUserId: true })];
    }

    getDefaults(){
        return {
            tracks: [],
            sharedWith: [],
            invitedProbands: [],
            ownerId: this.params.userId
        }
    }

}