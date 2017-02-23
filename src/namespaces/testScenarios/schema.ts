
import {StringSchema, ArraySchema, BooleanSchema} from "floodway";
import ObjectSchemaComposition from "../../ObjectSchemaComposition";


let schema = new ObjectSchemaComposition();

schema.registerChild(() => new StringSchema().length(36),"id",["db","TestScenario"]);
schema.registerChild(() => new StringSchema().length(36),"ownerId",["db","TestScenario"]);
schema.registerChild(() => new StringSchema().maxLength(32),"title",["db","TestScenario","create","update"]);
schema.registerChild(() => new StringSchema().maxLength(32),"description",["db","TestScenario","create","update"]);
schema.registerChild(() => new BooleanSchema(),"isPrivate",["db","TestScenario","create","update"]);
schema.registerChild(() => new ArraySchema().child(new StringSchema().length(36)),"sharedWith",["db","TestScenario","update"]);
schema.registerChild(() => new ArraySchema().child(new StringSchema().length(36)),"invitedProbands",["db","TestScenario","update"]);
schema.registerChild(() => new ArraySchema().child(new StringSchema().length(36)),"tracks",["db","TestScenario","update"]);



export default schema;