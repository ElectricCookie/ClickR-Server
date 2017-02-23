"use strict";
var ObjectSchemaComposition_1 = require("../../ObjectSchemaComposition");
var floodway_1 = require("floodway");
var schema_1 = require("../testScenarios/schema");
var schema = new ObjectSchemaComposition_1.default();
schema.registerChild(function () { return new floodway_1.StringSchema().length(36); }, "id", ["db", "ScenarioSession"]);
schema.registerChild(function () { return new floodway_1.StringSchema().length(36); }, "scenario", ["db"]);
schema.registerChild(function () { return schema_1.default.getGroup("TestScenario"); }, "scenario", ["ScenarioSession"]);
schema.registerChild(function () { return new floodway_1.StringSchema().length(36); }, "userId", ["db", "ScenarioSession"]);
schema.registerChild(function () { return new floodway_1.StringSchema().length(36); }, "currentTrackId", ["db", "ScenarioSession"]);
schema.registerChild(function () { return new floodway_1.NumberSchema(); }, "trackOffset", ["db", "ScenarioSession"]);
schema.registerChild(function () { return new floodway_1.NumberSchema(); }, "created", ["db", "ScenarioSession"]);
schema.registerChild(function () { return new floodway_1.NumberSchema(); }, "lastUpdated", ["db", "ScenarioSession"]);
schema.registerChild(function () { return new floodway_1.ArraySchema().child(new floodway_1.StringSchema().length(36)); }, "resultIds", ["db", "ScenarioSession"]);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = schema;
