import * as r from "rethinkdb";
import {WebAction, HttpMethod, ObjectSchema, StringSchema, NumberSchema} from "floodway";
import Authenticate from "../../user/middleware/authenticate";
import DbConnector from "../../../dbConnector";
export class SaveOffset extends WebAction{


    getUrl(){
        return "/scenarioSession/:id/:trackId/offset"
    }

    getHttpMethods(){
        return [HttpMethod.POST]
    }

    getWebMetaData(){
        return {
            name: "saveOffset",
            description: "Store the playback offset of a track",
            errors: [{ errorCode: "notFound", description: "The requested session/track was not foudn" }],
            middleware: [new Authenticate({ provideUserId: true })],
            params: new ObjectSchema("SaveOffsetParams").children({
                id: new StringSchema().length(36),
                trackId: new StringSchema().length(36),
                offset: new NumberSchema()
            }),
            result: new ObjectSchema("NoResult")
        }
    }

    run(){

        DbConnector.getDb((db) => {

            r.table("scenarioSessions").get(this.params.id).run(db,(err,res: any) => {

                if(err != null){ return this.fail("internalError"); }
                if(res == null){
                    return this.fail("notFound")
                }else{
                    let newTracks = res.tracks.map((item) => {

                        if(item.trackId == this.params.trackId && !item.played){

                            item.offset = this.params.offset;
                            if(this.params.offset == -1){
                                item.played = true;
                                item.offset = -1;
                            }

                        }


                        return item;
                    });
                    r.table("scenarioSessions").get(this.params.id).update({ tracks: newTracks }).run(db,(err,ops) => {

                        if(err != null){ return this.fail("internalError"); }

                        this.res({

                        });

                    })
                }

            });

        });

    }


}