"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var floodway_1 = require("floodway");
var throttle_1 = require("../../../throttle");
var Utils = require("../utils");
var request = require("superagent");
var dbConnector_1 = require("../../../dbConnector");
var AuthenticateGoogle = (function (_super) {
    __extends(AuthenticateGoogle, _super);
    function AuthenticateGoogle() {
        _super.apply(this, arguments);
    }
    AuthenticateGoogle.prototype.getMetaData = function () {
        return {
            name: "authenticateGoogle",
            description: "Logs in via Google or Stores data for registration via Google.",
            errors: [
                { errorCode: "invalidToken", description: "The token passed is invalid" },
                { errorCode: "notExistent", description: "No user registered with this Google-ID. Info was stored." }
            ],
            middleware: [new throttle_1.default("registerGoogle", 10)],
            supportsUpdates: false,
            params: new floodway_1.ObjectSchema("AuthenticateGoogleParams").children({
                username: new floodway_1.StringSchema().minLength(2).maxLength(32)
            }),
            result: new floodway_1.ObjectSchema("NoResult").children({})
        };
    };
    AuthenticateGoogle.prototype.authenticate = function (id) {
        var _this = this;
        var key = "user:" + this.sessionId;
        this.redis.set(key, id, function (err) {
            // Make sure that the session has been saved
            if (err != null) {
                return _this.fail("internalError");
            }
            // Empty but happy!
            _this.res({});
        });
    };
    AuthenticateGoogle.prototype.run = function () {
        var _this = this;
        request.get("https://www.googleapis.com/oauth2/v3/tokeninfo").query({
            id_token: this.params.token
        })
            .set('Accept', 'application/json')
            .end(function (err, res) {
            if (err == null) {
                var data_1 = res.body;
                dbConnector_1.default.getDb(function (db) {
                    r.table(Utils.TABLE_NAME).filter({
                        providerId: data_1.sub,
                        provider: "google"
                    }).run(db, function (err, cursor) {
                        if (err != null) {
                            return _this.fail("internalError", err);
                        }
                        cursor.toArray(function (err, res) {
                            if (err != null) {
                                return _this.fail("internalError", err);
                            }
                            if (res.length == 1) {
                                _this.authenticate(res[0].id);
                            }
                            else {
                                _this.redis.hmset(_this.sessionId + ":googleInfo", {
                                    email: data_1.email,
                                    id: data_1.sub,
                                    fullName: data_1.name,
                                    picture: data_1.picture
                                });
                                return _this.fail("notExistent");
                            }
                        });
                    });
                });
            }
        });
    };
    return AuthenticateGoogle;
}(floodway_1.Action));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthenticateGoogle;
