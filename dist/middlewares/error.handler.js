"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.send(`<h1>${err.status || 500} Error</h1>` + `<pre>${err.message}</pre>`);
    next();
};
exports.default = errorHandler;
