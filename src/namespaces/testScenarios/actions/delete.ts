import {WebAction, StringSchema, ObjectSchema} from "floodway";
import {DeleteAction} from "../../../rethinkAdapter/DeleteAction";
import DbConnector from "../../../dbConnector";
export class Delete extends DeleteAction{


    getDb(callback){
        DbConnector.getDb(callback)
    }

    getItemName(){
        return "testScenario";
    }


}