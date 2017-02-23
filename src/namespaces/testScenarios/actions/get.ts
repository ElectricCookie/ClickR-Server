import {ObjectSchema} from "floodway";
import schema from "../schema";
import {GetAction} from "../../../rethinkAdapter/GetAction";
import DbConnector from "../../../dbConnector";

export default class Get extends GetAction{

    getDb(cb){
        DbConnector.getDb(cb);
    }

    getItemName(){
        return "testScenario"
    }

    getOutputSchema(){
        return schema.getGroup("TestScenario")
    }

}