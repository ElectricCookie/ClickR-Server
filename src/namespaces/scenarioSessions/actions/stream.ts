import {StreamSingleAction} from "../../../rethinkAdapter/StreamSingleAction";
import schema from "../schema";
import { ObjectSchema} from "floodway";
import DbConnector from "../../../dbConnector";
export class Stream extends StreamSingleAction{


    getDb(callback){ DbConnector.getDb(callback)}

    getItemName(){ return "scenarioSession" }

    getOutputSchema(){ return schema.getGroup("ScenarioSession") }


}