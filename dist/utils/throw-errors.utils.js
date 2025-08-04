"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Models
const Errors_1 = require("../models/Errors");
// Constants
const errors_1 = require("../constants/errors");
const throwErrors = (type) => {
    const error = errors_1.ErrorMap[type];
    throw new Errors_1.ErrorWithStatus(error);
};
exports.default = throwErrors;
