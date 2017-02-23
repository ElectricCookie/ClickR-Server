
import {Middleware, Action, ObjectSchema, ObjectMode} from "floodway";
export default class Throttle extends Middleware{

    private tag: string;
    private timeout: number;

    constructor(tag: string,timeout: number){
        super();
        this.tag  = tag;
        this.timeout = timeout;
    }

    run(action: Action){
        let key = action.sessionId+":"+this.tag;
        action.redis.get(key,(err, res: string) => {
            if(err != null){ return this.fail("internalError",{ occurredAt: "throttle" }) }

            if(res == "true"){
                this.fail("requestThrottled")
            }else{
                action.redis.set(key,"true",(err,res) => {
                    if(err != null){ return this.fail("internalError",{ occurredAt: "throttle" }) }
                    action.redis.expire(key,this.timeout,(err,res) => {
                        if(err != null){ return this.fail("internalError",{ occurredAt: "throttle" }) }
                        this.next();
                    });

                })
            }
        })

    }


    getMetaData(){
        return{
            name: "Throttle",
            description: "Makes sure a request can only be executed a certain amount of times in series.",
            params: new ObjectSchema("NoParams").children({}).mode(ObjectMode.LOOSE),
            errors: [{ errorCode: "requestThrottled", description: "The request wasn't executed. Request throttled." }]
        }
    }
}