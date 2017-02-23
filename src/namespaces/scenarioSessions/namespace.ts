import {Namespace} from "floodway";
import GenerateSession from "./actions/generateSession";
import ListSessions from "./actions/listSessions";
import {Stream} from "./actions/stream";
import {SaveOffset} from "./actions/saveOffset";
import {StoreButtonPress} from "./actions/storeButtonPress";
export default class ScenarioSessions extends Namespace{


    constructor(){
        super();
        this.action(GenerateSession);
        this.action(ListSessions);
        this.action(Stream);
        this.action(SaveOffset);
        this.action(StoreButtonPress);
    }

    getName(){
        return "scenarioSessions"
    }

}