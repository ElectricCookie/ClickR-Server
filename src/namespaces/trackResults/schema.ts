

import ObjectSchemaComposition from "../../ObjectSchemaComposition";
import {StringSchema, BooleanSchema, NumberSchema, ObjectSchema, ArraySchema} from "floodway";
let group = new ObjectSchemaComposition();

group.registerChild(()=> new StringSchema().length(36) ,"id",["db","TrackResult"]);
group.registerChild(()=> new StringSchema().length(36) ,"trackId",["db","TrackResult"]);
group.registerChild(()=> new BooleanSchema() ,"done",["db","TrackResult"]);
group.registerChild(()=> new BooleanSchema() ,"skipped",["db","TrackResult"]);
group.registerChild(()=> new NumberSchema() ,"skippedAt",["db","TrackResult"]);
group.registerChild(()=> new ArraySchema().child(new ObjectSchema("ButtonPress").children({
    tag: new StringSchema(),
    offset: new NumberSchema(),
    pressDuration: new NumberSchema(),
})) ,"tags",["db","TrackResult"]);


