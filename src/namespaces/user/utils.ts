import * as UUID from "node-uuid";
import {pbkdf2,createHash} from "crypto";

export const TABLE_NAME = "users";
export const SESSION_PREFIX = "userSession:";
export const getRandomHash = (): string => {
    return createHash("sha1").update(UUID.v4()).digest().toString("hex")
};

export const digestPassword = (password,salt,callback) => {
    pbkdf2(password,salt, 100000, 512, 'sha512', (err, key) => {
      if(err != null){
          callback(err,null);
      }else{
          callback(null,key.toString("hex"));
      }
    });
};

export const md5 = (input: string): string => {
    return createHash("md5").update(input).digest().toString("hex")
};