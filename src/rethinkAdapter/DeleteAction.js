"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var r = require("rethinkdb");
var floodway_1 = require("floodway");
var RestBase_1 = require("./RestBase");
var DeleteAction = (function (_super) {
    __extends(DeleteAction, _super);
    function DeleteAction() {
        _super.apply(this, arguments);
    }
    DeleteAction.prototype.getSchema = function () {
        return null;
    };
    DeleteAction.prototype.makeClassName = function (input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    };
    DeleteAction.prototype.getHttpMethods = function () {
        return [floodway_1.HttpMethod.DELETE];
    };
    DeleteAction.prototype.getWebMetaData = function () {
        return {
            name: "delete" + this.makeClassName(this.getItemName()),
            description: "Deletes a " + this.getItemName(),
            errors: [{ errorCode: "notFound", description: "The specified item was not found" }],
            middleware: this.getMiddleware(),
            params: new floodway_1.ObjectSchema("IdContainer").children({
                id: new floodway_1.StringSchema().length(36)
            }),
            result: new floodway_1.ObjectSchema("EmptyResult")
        };
    };
    DeleteAction.prototype.run = function () {
        var _this = this;
        this.getDb(function (db) {
            r.table(_this.getTable()).get(_this.params.id).delete().run(db, function (err, res) {
                if (err != null || res.deleted == 0) {
                    return _this.fail("notFound");
                }
                _this.res({});
            });
        });
    };
    return DeleteAction;
}(RestBase_1.RestBase));
exports.DeleteAction = DeleteAction;
