"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorEntity = exports.ErrorWithStatus = void 0;
// Constants
const http_status_1 = __importDefault(require("../constants/http-status"));
const messages_1 = require("../constants/messages");
class ErrorWithStatus {
    message;
    status;
    constructor({ message, status }) {
        this.message = message;
        this.status = status;
    }
    getMessage() {
        return this.message;
    }
    getStatus() {
        return this.status;
    }
    setMessage(message) {
        this.message = message;
    }
    setStatus(status) {
        this.status = status;
    }
}
exports.ErrorWithStatus = ErrorWithStatus;
class ErrorEntity extends ErrorWithStatus {
    errors;
    constructor({ message, status, errors }) {
        super({ message: message || messages_1.USERS_MESSAGES.VALIDATION_ERROR, status: status || http_status_1.default.UNPROCESSABLE_ENTITY });
        this.errors = errors;
    }
    getErrors() {
        return this.errors;
    }
}
exports.ErrorEntity = ErrorEntity;
