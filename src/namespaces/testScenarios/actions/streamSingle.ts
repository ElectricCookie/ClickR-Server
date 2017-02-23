import DbConnector from "../../../dbConnector";
import schema from "../schema";
import * as r from "rethinkdb";
import {ObjectSchema, StringSchema, ObjectMode} from "floodway";
import {StreamSingleAction} from "../../../rethinkAdapter/StreamSingleAction";
export default class StreamSingleTestScenario extends StreamSingleAction{

    getDb(callback){
        DbConnector.getDb(callback);
    }

    getName(){
        return "streamSingle";
    }

    getItemName(){
        return "testScenario";
    }

    getOutputSchema(){
        return schema.getGroup("TestScenario").mode(ObjectMode.SHORTEN);
    }


}