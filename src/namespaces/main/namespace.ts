import {Namespace} from "floodway";
import About from "./about";
export default class Main extends Namespace{


    constructor(){
        super();
        this.action(About);
    }


    getName(){
        return "main"
    }

}