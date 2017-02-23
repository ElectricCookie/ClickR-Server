"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var floodway_1 = require("floodway");
var dbConnector_1 = require("../../../dbConnector");
var Utils = require("../utils");
var r = require("rethinkdb");
var CheckUsername = (function (_super) {
    __extends(CheckUsername, _super);
    function CheckUsername() {
        _super.apply(this, arguments);
    }
    CheckUsername.prototype.getHttpMethods = function () {
        return [floodway_1.HttpMethod.GET];
    };
    CheckUsername.prototype.getUrl = function () {
        return "/user/checkUsername/:username";
    };
    CheckUsername.prototype.getWebMetaData = function () {
        return {
            name: "checkUsername",
            description: "Checks if a username is taken",
            errors: [{ errorCode: "usernameTaken", description: "The username you chose is already taken" }],
            middleware: [],
            params: new floodway_1.ObjectSchema("CheckUsernameParams").children({
                username: new floodway_1.StringSchema().minLength(32)
            }),
            result: new floodway_1.ObjectSchema("CheckUsernameResult").children({
                isTaken: new floodway_1.BooleanSchema()
            })
        };
    };
    CheckUsername.checkUsername = function (username, callback) {
        dbConnector_1.default.getDb(function (db) {
            r.table(Utils.TABLE_NAME).filter(r.row("username").toLowerCase().eq(username)).count().run(db, function (err, count) {
                if (err != null) {
                    callback("internalError");
                }
                else {
                    if (count == 0) {
                        callback(null);
                    }
                    else {
                        callback("usernameTaken");
                    }
                }
            });
        });
    };
    CheckUsername.prototype.run = function () {
        var _this = this;
        CheckUsername.checkUsername(this.params.username, function (err) {
            if (err != null) {
                return _this.fail(err);
            }
            _this.res({
                taken: false
            });
        });
    };
    return CheckUsername;
}(floodway_1.WebAction));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CheckUsername;
