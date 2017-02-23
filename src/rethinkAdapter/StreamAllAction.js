"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var r = require("rethinkdb");
var __entry_1 = require("floodway/dist/__entry");
var RestBase_1 = require("./RestBase");
var StreamAllAction = (function (_super) {
    __extends(StreamAllAction, _super);
    function StreamAllAction() {
        _super.apply(this, arguments);
    }
    StreamAllAction.prototype.getFilter = function () {
        return {};
    };
    StreamAllAction.prototype.getSchema = function () {
        return null;
    };
    StreamAllAction.prototype.getName = function () {
        return "streamAll";
    };
    StreamAllAction.prototype.getMetaData = function () {
        return {
            name: this.getName(),
            description: "Get all items from the database",
            errors: [],
            supportsUpdates: true,
            middleware: this.getMiddleware(),
            params: this.getParams(),
            result: new __entry_1.ObjectSchema("StreamResult").mode(__entry_1.ObjectMode.PARTIAL).children({
                type: new __entry_1.StringSchema().oneOf(["value", "removed", "initial"]),
                id: new __entry_1.StringSchema().length(36),
                value: this.getOutputSchema(),
                values: new __entry_1.ArraySchema().child(this.getOutputSchema())
            }),
        };
    };
    StreamAllAction.prototype.getParams = function () {
        return new __entry_1.ObjectSchema("NoParams").children({});
    };
    StreamAllAction.prototype.run = function () {
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
                    _this.res({
                        type: "initial",
                        values: items
                    });
                });
            });
            r.table(_this.getTable()).filter(_this.getFilter()).changes().run(db, function (err, cursor) {
                if (err != null) {
                    return _this.fail("internalError", err);
                }
                cursor.each(function (err, ev) {
                    if (err != null) {
                        return _this.fail("internalError", err);
                    }
                    if (ev.new_val != null) {
                        _this.res({
                            type: "value",
                            id: ev.new_val.id,
                            value: ev.new_val
                        });
                    }
                    else {
                        _this.res({
                            type: "removed",
                            id: ev.old_val.id,
                        });
                    }
                });
                _this.once("done", function () {
                    cursor.close();
                });
            });
        });
    };
    return StreamAllAction;
}(RestBase_1.CrudBase));
exports.StreamAllAction = StreamAllAction;
