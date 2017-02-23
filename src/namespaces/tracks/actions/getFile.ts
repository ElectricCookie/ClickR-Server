
import {DownloadAction, ObjectSchema} from "floodway";
import schema from "../schema";
import *  as r from "rethinkdb"
import {AutoPopulate} from "../../../autoPopulate";
import Authenticate from "../../user/middleware/authenticate";
export default class GetFile extends DownloadAction{

    getName(){
        return "file"
    }

    getUrl(){
        return "/file/:track"
    }

    getMiddleware(){
        // No access check since it's the file only
        return [new AutoPopulate({
            key: "track",
            checkOnly: false,
            table: "tracks",
            getFilter: (action) => { return {}; },
            isArray: false
        })]
    }

    getParams(){

        return new ObjectSchema("GetFileParams").children({
            track: schema.getGroup("db")
        })

        
    }

    run(){
        console.log(this.params.track.filePath);
        this.res({
            path: this.params.track.filePath
        })
    }


}