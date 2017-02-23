import * as r from "rethinkdb";
import {Connection} from "rethinkdb";
import {EventEmitter} from "events";

export default class DbConnector extends EventEmitter{

    private connection: Connection;

    private static mInstance;

    public static getDb(callback: {( conn: Connection )}){
        if(this.mInstance == null){
            this.mInstance = new DbConnector();
        }

        this.mInstance.getConnection(callback);

    }

    constructor(){
        super();
        let db = "clickr";

        let tables = ["users","testScenarios","tracks","scenarioSessions","tags"];

        r.connect({ host: "localhost", port: 28015, db },(err: Error, conn: Connection) => {
            if(err){
                throw err
            }else{
                this.connection = conn;
                this.emit("ready",conn);

                r.db(db).tableList().run(conn,(err,res) => {
                    for(let name of tables){
                        if(res.indexOf(name) == -1){
                            r.db(db).tableCreate(name).run(conn,(err,ops) => {
                                console.log("Created table: "+name)
                            });
                        }
                    }
                });



            }
        })
    }

    getConnection(callback: {( conn: Connection )}){

        if(this.connection != null){
            callback(this.connection);
        }else{
            this.once("ready",callback);
        }

    }
}