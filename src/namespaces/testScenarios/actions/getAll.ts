
import {ObjectSchema} from "floodway";
import schema from "../schema";
import {GetAllAction} from "../../../rethinkAdapter/GetAllAction";
import DbConnector from "../../../dbConnector";

export default class GetAll extends GetAllAction{

    getDb(cb){
        DbConnector.getDb(cb);
    }

    getItemName(){
        return "testScenario"
    }

    getOutputSchema(){
        return schema.getGroup("TestScenario");
    }
}