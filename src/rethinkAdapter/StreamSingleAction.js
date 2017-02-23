"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RestBase_1 = require("./RestBase");
var floodway_1 = require("floodway");
var r = require("rethinkdb");
var StreamSingleAction = (function (_super) {
    __extends(StreamSingleAction, _super);
    function StreamSingleAction() {
        _super.apply(this, arguments);
    }
    StreamSingleAction.prototype.getFilter = function () {
        return {};
    };
    StreamSingleAction.prototype.getSchema = function () {
        return null;
    };
    StreamSingleAction.prototype.getName = function () {
        return "stream";
    };
    StreamSingleAction.prototype.getMetaData = function () {
        return {
            name: this.getName(),
            description: "Stream an item from the DB",
            errors: [{ errorCode: "valueRemoved", description: "The document was removed" }],
            supportsUpdates: true,
            middleware: this.getMiddleware(),
            params: this.getParams(),
            result: this.getOutputSchema(),
        };
    };
    StreamSingleAction.prototype.getParams = function () {
        return new floodway_1.ObjectSchema("StreamSingleParams").children({
            id: new floodway_1.StringSchema().length(36)
        });
    };
    StreamSingleAction.prototype.run = function () {
        var _this = this;
        this.getDb(function (db) {
            r.table(_this.getTable()).get(_this.params.id).changes({ includeInitial: true }).run(db, function (err, cursor) {
                if (err != null) {
                    return _this.fail("internalError", err);
                }
                cursor.each(function (err, ev) {
                    if (err != null) {
                        return _this.fail("internalError", err);
                    }
                    if (ev.new_val != null) {
                        _this.res(ev.new_val);
                    }
                    else {
                        _this.fail("valueRemoved");
                    }
                });
                _this.once("done", function () {
                    cursor.close();
                });
            });
        });
    };
    return StreamSingleAction;
}(RestBase_1.CrudBase));
exports.StreamSingleAction = StreamSingleAction;
