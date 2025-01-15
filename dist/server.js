"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("./api"));
const database_1 = require("./common/database");
const error_handler_1 = __importDefault(require("./middlewares/error.handler"));
const generate_response_1 = __importDefault(require("./middlewares/generate-response"));
(0, database_1.initDb)();
const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
    methods: "GET,PUT,POST,DELETE,PATCH",
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: "Content-Type, Authorization, Credentials",
};
const app = (0, express_1.default)();
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)(corsOptions));
app.use(error_handler_1.default);
app.use(generate_response_1.default);
app.use("/api", api_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});
exports.default = app;
