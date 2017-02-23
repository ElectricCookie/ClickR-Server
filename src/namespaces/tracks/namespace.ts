import {Namespace} from "floodway";


import Get from "./actions/get";
import Upload from "./actions/upload";
import StreamSingle from "./actions/streamSingle";
import GetFile from "./actions/getFile";
import StreamAll from "./actions/streamAll";
import Update from "./actions/update";
import Delete from "./actions/delete";

export default class Tracks extends Namespace{

    constructor(){
        super();
        this.action(Upload);
        this.action(StreamSingle);
        this.action(Get);
        this.action(GetFile);
        this.action(StreamAll);
        this.action(Delete);
        this.action(Update);
    }


    getName(){
        return "tracks"
    }
}