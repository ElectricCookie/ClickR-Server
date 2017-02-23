
import ObjectSchemaComposition from "../../ObjectSchemaComposition";
import {StringSchema, NumberSchema, ArraySchema, ObjectSchema, BooleanSchema} from "floodway";
import testScenarioSchema from "../testScenarios/schema";
let schema = new ObjectSchemaComposition();

schema.registerChild(() => new StringSchema().length(36),"id",["db","ScenarioSession"]);

schema.registerChild(() => new StringSchema().length(36),"scenario",["db","ScenarioSession"]);

schema.registerChild(() => new StringSchema(),"title",["db","ScenarioSession"]);
schema.registerChild(() => new StringSchema(),"description",["db","ScenarioSession"]);

schema.registerChild(() => new StringSchema().length(36),"user",["db","ScenarioSession"]);
schema.registerChild(() => new NumberSchema(),"created",["db","ScenarioSession"]);
schema.registerChild(() => new NumberSchema(),"lastUpdated",["db","ScenarioSession"]);
schema.registerChild(() => new ArraySchema().child(new ObjectSchema("ResultTrack").children({
    trackId: new StringSchema().length(36),
    played: new BooleanSchema(),
    offset: new NumberSchema()
})),"tracks",["db","ScenarioSession"]);

export default schema;