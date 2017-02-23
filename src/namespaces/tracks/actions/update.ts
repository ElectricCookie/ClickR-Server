import {UpdateAction} from "../../../rethinkAdapter/UpdateAction";
import DbConnector from "../../../dbConnector";
import schema from "../schema";
import {ObjectSchema, ObjectMode} from "floodway";
export default class Update extends UpdateAction{


    getDb(callback){
        DbConnector.getDb(callback);
    }

    getItemName(){
        return "track"
    }

    getSchema(){
        return schema.getGroup("update").mode(ObjectMode.SHORTEN)
    }

}