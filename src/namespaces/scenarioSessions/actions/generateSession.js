"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var floodway_1 = require("floodway");
var schema_1 = require("../../testScenarios/schema");
var autoPopulate_1 = require("../../../autoPopulate");
var r = require("rethinkdb");
var authenticate_1 = require("../../user/middleware/authenticate");
var dbConnector_1 = require("../../../dbConnector");
var GenerateSession = (function (_super) {
    __extends(GenerateSession, _super);
    function GenerateSession() {
        _super.apply(this, arguments);
    }
    GenerateSession.prototype.getUrl = function () {
        return "/session/new";
    };
    GenerateSession.prototype.getHttpMethods = function () {
        return [floodway_1.HttpMethod.POST];
    };
    GenerateSession.prototype.getWebMetaData = function () {
        return {
            name: "generateSession",
            description: "creates a new Session",
            errors: [],
            middleware: [new autoPopulate_1.AutoPopulate({
                    key: "scenarioId",
                    outKey: "scenario",
                    table: "testScenarios",
                    getFilter: function () {
                        return r.row("tracks").count().gt(0);
                    },
                    checkOnly: false,
                    isArray: false
                }), new authenticate_1.default({
                    provideUserId: true
                })],
            params: new floodway_1.ObjectSchema("GenerateSessionParamsPopulated").children({
                userId: new floodway_1.StringSchema().length(36),
                scenario: schema_1.default.getGroup("db"),
            }),
            exposeParams: new floodway_1.ObjectSchema("GenerateSessionParams").children({
                scenarioId: new floodway_1.StringSchema().length(36),
            }),
            result: new floodway_1.ObjectSchema("GenerateSessionResult").children({
                id: new floodway_1.StringSchema().length(36)
            })
        };
    };
    GenerateSession.prototype.run = function () {
        var _this = this;
        dbConnector_1.default.getDb(function (db) {
            var group = new floodway_1.AsyncGroup(function (err, ids) {
                r.table("scenarioSessions").insert({
                    created: Date.now(),
                    lastUpdated: Date.now(),
                    user: _this.params.userId,
                    currentTrackId: _this.params.scenario.tracks[0],
                    trackOffset: 0,
                    scenario: _this.params.scenario.id,
                    results: ids
                }).run(db, function (err, ops) {
                    if (err != null) {
                        return _this.fail("internalError", err);
                    }
                    _this.res({
                        id: ops.generated_keys[0]
                    });
                });
            });
            var _loop_1 = function(track) {
                group.add(function (callback) {
                    r.table("trackResults").insert({
                        trackId: track,
                        skipped: false,
                        offset: 0,
                        done: false,
                        skippedAt: 0,
                        tags: []
                    }).run(db, function (err, ops) {
                        if (err != null) {
                            callback(err, null);
                        }
                        else {
                            callback(null, ops.generated_keys[0]);
                        }
                    });
                });
            };
            for (var track in _this.params.scenario.tracks) {
                _loop_1(track);
            }
            group.run();
        });
    };
    return GenerateSession;
}(floodway_1.WebAction));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GenerateSession;
