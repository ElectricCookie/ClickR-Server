"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dbConnector_1 = require("../../../dbConnector");
var r = require("rethinkdb");
var Utils = require("../utils");
var floodway_1 = require("floodway");
var Authenticate = (function (_super) {
    __extends(Authenticate, _super);
    function Authenticate(params) {
        _super.call(this);
        this.params = {
            provideUser: params.provideUser != null ? params.provideUser : false,
            provideUserId: params.provideUserId != null ? params.provideUserId : false,
            userKey: params.userKey != null ? params.userKey : "user",
            userIdKey: params.userIdKey != null ? params.userIdKey : "userId",
            checkGroup: params.checkGroup
        };
    }
    Authenticate.prototype.getMetaData = function () {
        return {
            name: "authenticate",
            description: "Authenticate a user. Can also provide the user as parameter to the action. checking the DB for the user is optional",
            errors: [
                { errorCode: "notLoggedIn", description: "You do not have access to this action." },
                { errorCode: "notEnoughPermissions", description: "The user doesnt have the required groups to perform this action" }
            ],
            params: new floodway_1.ObjectSchema("AuthenticateParams").mode(floodway_1.ObjectMode.LOOSE)
        };
    };
    Authenticate.prototype.run = function (action) {
        var _this = this;
        if (action.sessionId != null) {
            action.redis.get("user:" + action.sessionId, function (err, res) {
                if (err != null) {
                    return _this.fail("internalError", { occuredAt: "authenticate" });
                }
                if (res != null && res.length == 36) {
                    // Authenticated.
                    if (_this.params.provideUserId) {
                        action.params[_this.params.userIdKey] = res;
                    }
                    if (_this.params.provideUser || _this.params.checkGroup != null) {
                        dbConnector_1.default.getDb(function (db) {
                            r.table(Utils.TABLE_NAME).filter({ id: res }).run(db, function (err, res) {
                                if (err != null) {
                                    return _this.fail("internalError", { occuredAt: "authenticate" });
                                }
                                res.toArray(function (err, res) {
                                    if (res.length == 1) {
                                        if (_this.params.provideUser) {
                                            action.params[_this.params.userKey] = res[0];
                                        }
                                        if (_this.params.checkGroup != null) {
                                            for (var _i = 0, _a = _this.params.checkGroup; _i < _a.length; _i++) {
                                                var group = _a[_i];
                                                if (res[0].groups.indexOf(group) == -1) {
                                                    _this.fail("notEnoughPermissions", { missingGroup: group });
                                                    break;
                                                }
                                            }
                                            _this.next();
                                        }
                                        else {
                                            _this.next();
                                        }
                                    }
                                    else {
                                        _this.fail("notLoggedIn", action);
                                    }
                                });
                            });
                        });
                    }
                    else {
                        _this.next();
                    }
                }
                else {
                    _this.fail("notLoggedIn", action);
                }
            });
        }
        else {
            this.fail("notLoggedIn", action);
        }
    };
    return Authenticate;
}(floodway_1.Middleware));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Authenticate;
