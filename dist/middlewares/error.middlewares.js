"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Constants
const http_status_1 = __importDefault(require("../constants/http-status"));
// Models
const Errors_1 = require("../models/Errors");
const defaultErrorHandler = (err, req, res, next) => {
    if (err instanceof Errors_1.ErrorWithStatus || err instanceof Errors_1.ErrorEntity) {
        res.status(err.getStatus() || http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: err.getMessage() || 'Some thing went wrong',
            errors: err instanceof Errors_1.ErrorEntity ? err.getErrors() : undefined
        });
    }
    else {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: err.message || 'Some thing went wrong'
        });
    }
};
exports.default = defaultErrorHandler;
