import {Action, WebAction, HttpMethod, ObjectSchema, NumberSchema} from "floodway";
export default class About extends WebAction{


    getWebMetaData(){
        return {
            name: "about",
            middleware: [],
            supportsUpdates: false,
            description: "Used to retrieve SSID by WS Clients",
            params: new ObjectSchema("NoParams").children({}),
            result: new ObjectSchema("AboutResult").children({
                time: new NumberSchema()
            }),
            errors: []
        }
    }

    getUrl(){
        return "/about"
    }

    getHttpMethods(){
        return [HttpMethod.GET,HttpMethod.POST];
    }


    run(){
        this.res({
            time: Date.now()
        })
    }

}