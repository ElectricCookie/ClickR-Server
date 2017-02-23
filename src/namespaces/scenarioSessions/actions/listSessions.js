"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var floodway_1 = require("floodway");
var schema_1 = require("../../testScenarios/schema");
var r = require("rethinkdb");
var authenticate_1 = require("../../user/middleware/authenticate");
var ListSessions = (function (_super) {
    __extends(ListSessions, _super);
    function ListSessions() {
        _super.apply(this, arguments);
    }
    ListSessions.prototype.getMetaData = function () {
        return {
            name: "listSessions",
            description: "Get all session the current user is participating in",
            middleware: [new authenticate_1.default({ provideUserId: true })],
            supportsUpdates: false,
            errors: [],
            params: new floodway_1.ObjectSchema("ListSessionsParams").children({}),
            result: new floodway_1.ObjectSchema("ListSessionsResult").children({
                items: new floodway_1.ArraySchema().child(schema_1.default.getGroup("ScenarioSession"))
            })
        };
    };
    ListSessions.prototype.run = function () {
        r.table("scenarioSessions").filter({ userId: this.params.userId }).eq_join("scenario", r.table("testScenarios"));
    };
    return ListSessions;
}(floodway_1.Action));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ListSessions;
