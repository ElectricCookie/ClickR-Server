"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var r = require("rethinkdb");
var __entry_1 = require("floodway/dist/__entry");
var RestBase_1 = require("./RestBase");
var GetAllAction = (function (_super) {
    __extends(GetAllAction, _super);
    function GetAllAction() {
        _super.apply(this, arguments);
    }
    GetAllAction.prototype.getFilter = function () {
        return {};
    };
    GetAllAction.prototype.getSchema = function () {
        return null;
    };
    GetAllAction.prototype.getUrl = function () {
        return this.getPath() + "/";
    };
    GetAllAction.prototype.getHttpMethods = function () {
        return [__entry_1.HttpMethod.GET];
    };
    GetAllAction.prototype.getWebMetaData = function () {
        return {
            name: "getAll" + this.getItemNamePlural(),
            description: "Get all items from the database",
            errors: [],
            supportsUpdates: false,
            middleware: this.getMiddleware(),
            params: new __entry_1.ObjectSchema("NoParams").children({}),
            result: new __entry_1.ObjectSchema("ResultEnvelope").children({ items: new __entry_1.ArraySchema().child(this.getOutputSchema().mode(__entry_1.ObjectMode.PARTIAL)) })
        };
    };
    GetAllAction.prototype.run = function () {
        var _this = this;
        this.getDb(function (db) {
            r.table(_this.getTable()).filter(_this.getFilter).run(db, function (err, cursor) {
                if (err != null) {
                    return _this.fail("internalError", err);
                }
                cursor.toArray(function (err, items) {
                    if (err != null) {
                        return _this.fail("internalError", err);
                    }
                    _this.res(items);
                });
            });
        });
    };
    return GetAllAction;
}(RestBase_1.RestBase));
exports.GetAllAction = GetAllAction;
