"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var r = require("rethinkdb");
var floodway_1 = require("floodway");
var RestBase_1 = require("./RestBase");
var UpdateAction = (function (_super) {
    __extends(UpdateAction, _super);
    function UpdateAction() {
        _super.apply(this, arguments);
    }
    UpdateAction.prototype.getWebMetaData = function () {
        return {
            name: "update",
            description: "Update an item in the database",
            errors: [],
            middleware: this.getMiddleware(),
            params: new floodway_1.ObjectSchema("UpdateParams").children({
                item: this.getSchema().mode(floodway_1.ObjectMode.PARTIAL),
                id: new floodway_1.StringSchema().length(36)
            }),
            result: new floodway_1.ObjectSchema("EmptyResult").children({}),
        };
    };
    UpdateAction.prototype.getUrl = function () {
        return this.getPath() + "/:id";
    };
    UpdateAction.prototype.getHttpMethods = function () {
        return [floodway_1.HttpMethod.PATCH];
    };
    UpdateAction.prototype.run = function () {
        var _this = this;
        this.getDb(function (db) {
            r.table(_this.getTable()).filter({ id: _this.params.id }).update(_this.params.item).run(db, function (err, res) {
                if (err != null) {
                    return _this.fail("internalError", err);
                }
                _this.res({
                    updated: res.replaced
                });
            });
        });
    };
    return UpdateAction;
}(RestBase_1.RestBase));
exports.UpdateAction = UpdateAction;
