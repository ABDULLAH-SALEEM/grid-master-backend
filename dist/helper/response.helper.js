"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateErrorObject = exports.manageError = void 0;
const manageError = (err) => {
    const errObject = Object.assign({ message: 'Error in operation', code: 400 }, err);
    const code = err.code || err.statusCode;
    if (Array.isArray(err.errors)) {
        let msg = '';
        err.errors.forEach(function (error) {
            if (msg)
                msg += ' ,';
            msg += error.message;
        });
        errObject.message = msg;
        errObject.code = 422;
    }
    if (err.message && code) {
        if (code === 11000) {
            let message = '';
            errObject.code = 400;
            errObject.errors = [];
            for (const prop in err.keyValue) {
                errObject.errors.push({
                    [prop]: `${err.keyValue[prop]} already exists`,
                });
                if (message) {
                    message += ', ';
                }
                message += `${prop} with ${err.keyValue[prop]} already exists!`;
            }
            errObject.message = message;
        }
        else if (code === 'ECONNREFUSED') {
            errObject.code = 400;
            errObject.message = `Invalid url or host not found: ${err.config.url}`;
        }
        else {
            errObject.message = err.message;
            errObject.code = code;
        }
    }
    else if (err.message && err.name == 'TypeError') {
        errObject.message = err.message;
        errObject.code = 422;
    }
    else if (err.message && err.name == 'JsonWebTokenError') {
        errObject.message = 'Invalid token!';
        errObject.code = 422;
    }
    else if (err.message && err.name == 'TokenExpiredError') {
        errObject.message = 'Token has been expired!';
        errObject.code = 422;
    }
    else if (err.message) {
        errObject.message = err.message;
        errObject.code = 422;
    }
    if (typeof errObject.code !== 'number' ||
        errObject.code > 500 ||
        errObject.code < 400) {
        errObject.code = 400;
        errObject.message = 'Please contact with admin for this issue!';
    }
    return errObject;
};
exports.manageError = manageError;
const generateErrorObject = (errorCode, message, errors = []) => {
    return {
        code: errorCode,
        message,
        errors,
    };
};
exports.generateErrorObject = generateErrorObject;
