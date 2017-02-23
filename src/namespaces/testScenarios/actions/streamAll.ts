import {ObjectSchema} from "floodway";

import schema from "../schema";
import * as r from "rethinkdb";
import {StreamAllAction} from "../../../rethinkAdapter/StreamAllAction";
import DbConnector from "../../../dbConnector";
import Authenticate from "../../user/middleware/authenticate";
export default class StreamAll extends StreamAllAction{

    getDb(cb){
        DbConnector.getDb(cb);
    }

    getMiddleware(){
        return [new Authenticate({
            provideUser: true
        })]
    }

    getFilter(){
        return r.row("ownerId").eq(this.params.user.id)
                .or(r.row("sharedWith").contains(this.params.user.id))
                .or(r.row("private").eq(false))
    }

    getItemName(){
        return "testScenario"
    }

    getOutputSchema(){
        return schema.getGroup("TestScenario");
    }
}
