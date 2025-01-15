"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = initDb;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const jet_logger_1 = __importDefault(require("jet-logger"));
mongoose_1.default.Promise = global.Promise;
const mongoosePaginateOptions = {
    customLabels: {
        docs: "rows",
        limit: "pageSize",
        page: "pageIndex",
    },
};
mongoose_paginate_v2_1.default.paginate.options = mongoosePaginateOptions;
mongoose_1.default.connection.on("connected", function () {
    jet_logger_1.default.info("Mongoose successfully connected");
});
mongoose_1.default.connection.on("error", function (err) {
    jet_logger_1.default.err(err);
});
mongoose_1.default.connection.on("disconnected", function () {
    jet_logger_1.default.warn("Mongoose connection disconnected");
});
function initDb() {
    try {
        mongoose_1.default.connect(process.env.MONGODB_URI || "");
    }
    catch (err) {
        console.log("err-->>>>", err);
    }
}
