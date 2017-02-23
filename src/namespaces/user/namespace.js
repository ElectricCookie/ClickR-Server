"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var floodway_1 = require("floodway");
var login_1 = require("./actions/login");
var getAccount_1 = require("./actions/getAccount");
var register_1 = require("./actions/register");
var search_1 = require("./actions/search");
var registerGoogle_1 = require("./actions/registerGoogle");
var getProfile_1 = require("./actions/getProfile");
var setUsername_1 = require("./actions/setUsername");
var User = (function (_super) {
    __extends(User, _super);
    function User() {
        _super.call(this);
        this.action(login_1.default);
        this.action(getAccount_1.default);
        this.action(register_1.default);
        this.action(search_1.default);
        this.action(registerGoogle_1.default);
        this.action(getProfile_1.default);
        this.action(setUsername_1.default);
    }
    User.prototype.getName = function () { return "user"; };
    return User;
}(floodway_1.Namespace));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = User;
