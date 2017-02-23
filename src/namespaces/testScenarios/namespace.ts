import {Namespace, ObjectSchema} from "floodway";
import Authenticate from "../user/middleware/authenticate";

import Create from "./actions/create"
import GetAll from "./actions/getAll"
import StreamAll from "./actions/streamAll"
import Get from "./actions/get"
import StreamSingleTestScenario from "./actions/streamSingle";
import Update from "./actions/update";
import GetOpenScenarios from "./actions/getOpenScenarios";
import {Delete} from "./actions/delete";


export default class TestScenario extends Namespace{

    getName(){
        return "testScenarios";
    }

    getMiddleware(){
        return [new Authenticate({})]
    }

    constructor(){
        super();
        this.action(Create);
        this.action(Get);
        this.action(GetAll);
        this.action(StreamSingleTestScenario);
        this.action(StreamAll);
        this.action(Update);
        this.action(GetOpenScenarios);
        this.action(Delete);

    }

}