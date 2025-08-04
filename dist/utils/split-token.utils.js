"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitAccessToken = void 0;
const splitAccessToken = (accessToken) => {
    const result = accessToken.split(' ')[1];
    return result;
};
exports.splitAccessToken = splitAccessToken;
