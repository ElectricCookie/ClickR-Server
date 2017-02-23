import {StringSchema, NumberSchema, Type, FileSchema, ArraySchema, ObjectSchema, BooleanSchema} from "floodway";
import ObjectSchemaComposition from "../../ObjectSchemaComposition";

let composition = new ObjectSchemaComposition();


composition.registerChild(() => new StringSchema().length(36),"id",["db","Track"]);
composition.registerChild(() => new StringSchema().length(36),"userId",["create"]);
composition.registerChild(() => new StringSchema().minLength(3),"title",["db","Track","createTrack","create","update"]);
composition.registerChild(() => new StringSchema(),"description",["db","Track","createTrack","create","update"]);
composition.registerChild(() => new ArraySchema().child(new StringSchema().length(36)),"sharedWith",["db","Track","update"]);
composition.registerChild(() => FileSchema,"file",["create"]);
composition.registerChild(() => new StringSchema(),"ownerId",["db","Track"]);
composition.registerChild(() => new StringSchema(),"filePath",["db"]);
composition.registerChild(() => new NumberSchema(),"created",["db","Track"]);
composition.registerChild(() => {
    return new ArraySchema().child(new ObjectSchema("Button").children({
        key: new StringSchema(),
        label: new StringSchema(),
        enable: new NumberSchema(),
        disable: new NumberSchema(),
        skipOnClick: new BooleanSchema()
    }))
},"buttons",["db","Track","update"]);

export default composition;
