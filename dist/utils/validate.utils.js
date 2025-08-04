"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const validateUser = async (schema, data) => {
    return schema.parseAsync(data);
};
exports.validateUser = validateUser;
