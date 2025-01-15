"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.getFirstAndLastName = getFirstAndLastName;
function generateOTP(length) {
    const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join("");
}
function getFirstAndLastName(name) {
    const words = name.trim().split(/\s+/);
    const firstName = words[0];
    const lastName = words.slice(1).join(" ");
    return { firstName, lastName };
}
