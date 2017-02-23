import DbConnector from "../../../dbConnector";
import schema from "../schema";
import * as r from "rethinkdb";
import {ObjectSchema, StringSchema, ObjectMode} from "floodway";
import {StreamSingleAction} from "../../../rethinkAdapter/StreamSingleAction";
export default class StreamSingleTrackAction extends StreamSingleAction{

    getDb(callback){
        DbConnector.getDb(callback);
    }

    getName(){
        return "streamSingle";
    }

    getItemName(){
        return "track";
    }

    getOutputSchema(){
        return schema.getGroup("Track").mode(ObjectMode.SHORTEN);
    }


}