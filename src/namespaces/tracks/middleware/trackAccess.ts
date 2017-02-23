import {Middleware, StringSchema, ObjectSchema, Type} from "floodway";
export default class TrackAccess extends Middleware{

    private trackIdKey: string;
    private userIdKey: string;
    private checkOwner: boolean;

    constructor(checkOwner: boolean = false,trackIdKey="id",userIdKey="userId"){
        super();
        this.trackIdKey = trackIdKey;
        this.userIdKey = userIdKey;
        this.checkOwner = checkOwner;
    }

    getParams(){

        let params: { [path:string]:Type} = {};

        params[this.userIdKey] = new  StringSchema().length(36);
        params[this.trackIdKey] = new  StringSchema().length(36);

        return new ObjectSchema("TrackAccessParams").children(params);

    }

    getMetaData(){
        return {
            name: "Track Access",
            description: "Permits access to a track",
            params: this.getParams(),
            errors: []
        }
    }

}