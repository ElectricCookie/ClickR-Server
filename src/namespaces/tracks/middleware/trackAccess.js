"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var floodway_1 = require("floodway");
var TrackAccess = (function (_super) {
    __extends(TrackAccess, _super);
    function TrackAccess(checkOwner, trackIdKey, userIdKey) {
        if (checkOwner === void 0) { checkOwner = false; }
        if (trackIdKey === void 0) { trackIdKey = "id"; }
        if (userIdKey === void 0) { userIdKey = "userId"; }
        _super.call(this);
        this.trackIdKey = trackIdKey;
        this.userIdKey = userIdKey;
        this.checkOwner = checkOwner;
    }
    TrackAccess.prototype.getParams = function () {
        var params = {};
        params[this.userIdKey] = new floodway_1.StringSchema().length(36);
        params[this.trackIdKey] = new floodway_1.StringSchema().length(36);
        return new floodway_1.ObjectSchema("TrackAccessParams").children(params);
    };
    TrackAccess.prototype.getMetaData = function () {
        return {
            name: "Track Access",
            description: "Permits access to a track",
            params: this.getParams(),
            errors: []
        };
    };
    return TrackAccess;
}(floodway_1.Middleware));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TrackAccess;
