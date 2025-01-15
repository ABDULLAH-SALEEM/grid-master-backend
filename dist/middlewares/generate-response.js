"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateResponse = (res, data, statusCode, message, respType = 'json') => {
    const responseObject = {};
    responseObject.data = data || '';
    responseObject.message = message || '';
    if (respType === 'raw') {
        return res.status(statusCode).send(data);
    }
    else {
        res.status(statusCode).json(responseObject);
    }
};
const responseHandler = (req, res, next) => {
    res.generateResponse = generateResponse;
    next();
};
exports.default = responseHandler;
