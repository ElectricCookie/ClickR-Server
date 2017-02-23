"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var floodway_1 = require("floodway");
var get_1 = require("./actions/get");
var upload_1 = require("./actions/upload");
var streamSingle_1 = require("./actions/streamSingle");
var getFile_1 = require("./actions/getFile");
var streamAll_1 = require("./actions/streamAll");
var update_1 = require("./actions/update");
var Tracks = (function (_super) {
    __extends(Tracks, _super);
    function Tracks() {
        _super.call(this);
        this.action(upload_1.default);
        this.action(streamSingle_1.default);
        this.action(get_1.default);
        this.action(getFile_1.default);
        this.action(streamAll_1.default);
        this.action(update_1.default);
    }
    Tracks.prototype.getName = function () {
        return "tracks";
    };
    return Tracks;
}(floodway_1.Namespace));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Tracks;
