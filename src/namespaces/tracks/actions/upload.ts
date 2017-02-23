import {Action, ObjectSchema, WebAction, StringSchema, ObjectMode, HttpMethod, FileSchema, BodyMode} from "floodway";
import schema from "../schema";
import DbConnector from "../../../dbConnector";
import * as r from "rethinkdb";
import Authenticate from "../../user/middleware/authenticate";
export default class Upload extends WebAction{


    getUrl(){
        return "/create"
    }

    getHttpMethods(){
        return [HttpMethod.POST]
    }

    allowUploads(){
        return true;
    }

    getBodyMode(){
        return BodyMode.UrlEncoded;
    }


    getWebMetaData(){
        return {
            name: "create",
            description: "Saves the new track to the database",
            supportsUpdates: false,
            params: schema.getGroup("create").mode(ObjectMode.LOOSE),
            result: new ObjectSchema("UploadResult").children({
                newId: new StringSchema().length(36),

            }),
            errors: [],
            middleware: [new Authenticate({ provideUserId: true })],
        }
    }

    run(){
        DbConnector.getDb((db) => {
            r.table("tracks").insert({
                title: this.params.title,
                description: this.params.description,
                buttons: [],
                created: Date.now(),
                filePath: this.params.file.path,
                ownerId: this.params.userId,
                sharedWith: []
            }).run(db,(err,res) => {
                if(err != null){ return this.fail("internalError",err) }
                this.res({
                    newId: res.generated_keys[0]
                })
            })
        })
    }

}