"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var r = require("rethinkdb");
var __entry_1 = require("floodway/dist/__entry");
var RestBase_1 = require("./RestBase");
var GetAction = (function (_super) {
    __extends(GetAction, _super);
    function GetAction() {
        _super.apply(this, arguments);
    }
    GetAction.prototype.getUrl = function () {
        return this.getPath() + "/:id";
    };
    GetAction.prototype.getHttpMethods = function () {
        return [__entry_1.HttpMethod.GET];
    };
    GetAction.prototype.getSchema = function () {
        return null;
    };
    GetAction.prototype.getFilter = function () {
        return { id: this.params.id };
    };
    GetAction.prototype.getWebMetaData = function () {
        return {
            name: "get",
            description: "Get an item from the database",
            errors: [{ errorCode: "notFound", description: "The item specified was not found" }],
            supportsUpdates: false,
            middleware: this.getMiddleware(),
            params: new __entry_1.ObjectSchema("IdContainer").children({
                id: new __entry_1.StringSchema().length(36)
            }),
            result: this.getOutputSchema().mode(__entry_1.ObjectMode.SHORTEN),
        };
    };
    GetAction.prototype.run = function () {
        var _this = this;
        this.getDb(function (db) {
            r.table(_this.getTable()).filter(_this.getFilter()).run(db, function (err, cursor) {
                if (err != null) {
                    return _this.fail("internalError", err);
                }
                cursor.toArray(function (err, items) {
                    if (err != null) {
                        return _this.fail("internalError", err);
                    }
                    if (items.length != 1) {
                        return _this.fail("notFound");
                    }
                    _this.res(items[0]);
                });
            });
        });
    };
    return GetAction;
}(RestBase_1.RestBase));
exports.GetAction = GetAction;
