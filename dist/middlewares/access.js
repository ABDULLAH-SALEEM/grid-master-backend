"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hasAccess = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        }
        else {
            return res.status(403).json({ message: 'Access Denied!' });
        }
    };
};
exports.default = hasAccess;
