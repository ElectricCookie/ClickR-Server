"use strict";
var ObjectSchemaComposition_1 = require("../../ObjectSchemaComposition");
var floodway_1 = require("floodway");
var group = new ObjectSchemaComposition_1.default();
group.registerChild(function () { return new floodway_1.StringSchema().length(36); }, "id", ["db", "TrackResult"]);
group.registerChild(function () { return new floodway_1.StringSchema().length(36); }, "trackId", ["db", "TrackResult"]);
group.registerChild(function () { return new floodway_1.BooleanSchema(); }, "done", ["db", "TrackResult"]);
group.registerChild(function () { return new floodway_1.BooleanSchema(); }, "skipped", ["db", "TrackResult"]);
group.registerChild(function () { return new floodway_1.NumberSchema(); }, "skippedAt", ["db", "TrackResult"]);
group.registerChild(function () { return new floodway_1.ArraySchema().child(new floodway_1.ObjectSchema("ButtonPress").children({
    tag: new floodway_1.StringSchema(),
    offset: new floodway_1.NumberSchema(),
    pressDuration: new floodway_1.NumberSchema(),
})); }, "tags", ["db", "TrackResult"]);
