import {Namespace} from "floodway";
import Login from "./actions/login";
import GetAccount from "./actions/getAccount";
import Register from "./actions/register";
import Search from "./actions/search";
import RegisterGoogle from "./actions/registerGoogle";
import GetProfile from "./actions/getProfile";
import AuthenticateGoogle from "./actions/authenticateGoogle";
import CheckUsername from "./actions/checkUsername";
export default class User extends Namespace{

    constructor(){
        super();
        this.action(Login);
        this.action(GetAccount);
        this.action(Register);
        this.action(Search);
        this.action(RegisterGoogle);
        this.action(GetProfile);
        this.action(AuthenticateGoogle);
        this.action(CheckUsername);
    }

    getName(){ return "user" }
}