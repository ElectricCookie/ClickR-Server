import {DeleteAction} from "../../../rethinkAdapter/DeleteAction";
import DbConnector from "../../../dbConnector";
export default class Delete extends DeleteAction{
    getItemName(){
        return "track"
    }
    getDb(cb){
        DbConnector.getDb(cb)
    }
}