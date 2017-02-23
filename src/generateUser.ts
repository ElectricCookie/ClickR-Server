import DbConnector from "./dbConnector";
import * as r from "rethinkdb";
import * as UUID from "node-uuid";
import {pbkdf2,createHash} from "crypto";
DbConnector.getDb((db) => {
    let password = "password123";
    let salt = createHash("sha1").update(UUID.v4()).digest().toString("hex");

    pbkdf2(password,salt, 100000, 512, 'sha512', (err, key) => {
        r.table("admins").insert({
            username: "admin",
            password: key.toString("hex"),
            salt: salt
        }).run(db,(err,res) => {
            console.log(err,res);
        })
    })

});