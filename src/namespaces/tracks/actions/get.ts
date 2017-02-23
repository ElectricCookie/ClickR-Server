import {GetAction} from "../../../rethinkAdapter/GetAction";
import DbConnector from "../../../dbConnector";
import schema from "../schema";
import {ObjectSchema} from "floodway";
export default class Get extends GetAction{

    getDb(callback){
        DbConnector.getDb(callback);
    }


    getItemName(){
        return "track";
    }

    getOutputSchema(){
        return schema.getGroup("Track");
    }

}