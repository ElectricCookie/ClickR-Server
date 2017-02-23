import {WebAction, HttpMethod, ObjectSchema, StringSchema, NumberSchema} from "floodway";
import Authenticate from "../../user/middleware/authenticate";
import * as r from "rethinkdb";
import {AutoPopulate} from "../../../autoPopulate";
import DbConnector from "../../../dbConnector";
export class StoreButtonPress extends WebAction{

    getUrl(){
        return "/scenarioSessions/:session/track/:trackId/:key/:offset"
    }


    getHttpMethods(){
        return [HttpMethod.GET]
    }

    getWebMetaData(){
        return {
            name: "storeButtonPress",
            description: "Stores a button press with trackId, scenario, userId and offset in the database",
            params: new ObjectSchema("ButtonPressPopulated").children({
                trackId: new StringSchema().length(36),
                session: new StringSchema().length(36),
                key: new StringSchema(),
                offset: new NumberSchema(),
                userId: new StringSchema().length(36)
            }),
            exposeParams: new ObjectSchema("ButtonPress").children({
                trackId: new StringSchema().length(36),
                session: new StringSchema().length(36),
                key: new StringSchema(),
                offset: new NumberSchema(),
            }),
            result: new ObjectSchema("EmptyResult"),
            errors: [
                { errorCode: "unknownTrack", description: "The associated track does not exist"},
                { errorCode: "unknownSession", description: "The session was not found" },
                { errorCode: "invalidKey", description: "The key passed does not exist" }
            ],
            middleware: [new Authenticate({ provideUserId: true })]
        }
    }


    run(){

        DbConnector.getDb((db) => {

            r.table("scenarioSessions").filter({ user: this.params.userId, id: this.params.session }).run(db,(err,cursor) => {
                if(err != null){ return this.fail("internalError",err) }

                cursor.toArray((err,items) => {
                    if(err != null){ return this.fail("internalError",err) }
                    if(items.length == 1){

                        let item = items[0];



                        r.table("tracks").get(this.params.trackId).run(db,(err,track: any) => {

                            let foundButton = false;

                            if(track == null){
                                return this.fail("unknownTrack");
                            }

                            track.buttons.map((item) => {

                                if(item.key == this.params.key){
                                    foundButton = true;
                                }

                            });

                            r.table("tags").insert({

                                session: this.params.session,
                                track: this.params.trackId,
                                user: this.params.userId,
                                key: this.params.key,
                                offset: this.params.offset

                            }).run(db,(err,ops) => {
                                if(err != null){
                                    return this.fail("internalError",err);
                                }
                            });

                            if(!foundButton){
                                return this.fail("invalidKey");
                            }

                        });




                    }else{
                        this.fail("unknownSession")
                    }
                })

            })

        });

    }

}