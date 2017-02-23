import {StringSchema, NumberSchema, BooleanSchema, Type, ArraySchema} from "floodway";
import ObjectSchemaComposition from "../../ObjectSchemaComposition";


let userSchema = new ObjectSchemaComposition();

userSchema.registerChild(() =>  new StringSchema().length(36),"id",["db","public","profile"]);
userSchema.registerChild(() =>  new StringSchema().minLength(2),"fullName",["db","public","profile","register"]);
userSchema.registerChild(() =>  new StringSchema().maxLength(32).minLength(3),"username",["db","public","profile","register","login"]);
userSchema.registerChild(() =>  new StringSchema().length(1024),"password",["db"]);
userSchema.registerChild(() =>  new StringSchema().length(40),"salt",["db"]);
userSchema.registerChild(() =>  new StringSchema().trim(true),"email",["db","profile","register"]);
userSchema.registerChild(() =>  new StringSchema().trim(true),"avatar",["db","profile","public"]);
userSchema.registerChild(() =>  new StringSchema().trim(true).maxLength(2048),"bio",["db","profile","public"]);
userSchema.registerChild(() =>  new StringSchema(),"resetPasswordToken",["db"]);
userSchema.registerChild(() =>  new NumberSchema(),"resetPasswordExpires",["db"]);
userSchema.registerChild(() =>  new StringSchema().minLength(5),"passwordInput",["register","login"]);
userSchema.registerChild(() =>  new StringSchema(),"activationToken",["db"]);
userSchema.registerChild(() =>  new BooleanSchema(),"activated",["db"]);
userSchema.registerChild(() =>  new NumberSchema(),"registered",["db","profile"]);
userSchema.registerChild(() =>  new StringSchema(),"provider",["db"]);
userSchema.registerChild(() =>  new StringSchema(),"providerId",["db"]);
userSchema.registerChild(() =>  new NumberSchema(),"lastSeen",["db","profile"]);
userSchema.registerChild(() =>  new ArraySchema().child(new StringSchema()),"groups",["db","profile"]);

export default userSchema;