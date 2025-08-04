"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function excludeFields(obj, keys) {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
exports.default = excludeFields;
