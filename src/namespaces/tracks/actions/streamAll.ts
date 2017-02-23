import {StreamAllAction} from "../../../rethinkAdapter/StreamAllAction";
import schema from "../schema";
import {ObjectSchema, ObjectMode} from "floodway";
import DbConnector from "../../../dbConnector";
export default class StreamAllTracksAction extends StreamAllAction{


    getDb(callback){
        DbConnector.getDb(callback);
    }

    getItemName(){
        return "track";
    }

    getOutputSchema(){
        return schema.getGroup("Track").mode(ObjectMode.SHORTEN);
    }

}