"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMap = void 0;
// Constants
const messages_1 = require("../constants/messages");
const http_status_1 = __importDefault(require("../constants/http-status"));
exports.ErrorMap = {
    USER_NOT_FOUND: {
        message: messages_1.USERS_MESSAGES.USER_NOT_FOUND,
        status: http_status_1.default.NOT_FOUND
    },
    EMAIL_EXISTS: {
        message: messages_1.USERS_MESSAGES.EMAIL_ALREADY_EXISTS,
        status: http_status_1.default.UNAUTHORIZED
    },
    EMAIL_NOT_EXISTS: {
        message: messages_1.USERS_MESSAGES.EMAIL_DOES_NOT_EXIST,
        status: http_status_1.default.UNAUTHORIZED
    },
    PASSWORD_INCORRECT: {
        message: messages_1.USERS_MESSAGES.PASSWORD_INCORRECT,
        status: http_status_1.default.UNAUTHORIZED
    },
    UNAUTHORIZED: {
        message: messages_1.USERS_MESSAGES.UNAUTHORIZED_ERROR,
        status: http_status_1.default.UNAUTHORIZED
    },
    ACCESS_TOKEN_REQUIRED: {
        message: messages_1.USERS_MESSAGES.ACCESS_TOKEN_REQUIRED,
        status: http_status_1.default.UNAUTHORIZED
    },
    INVALID_ACCESS_TOKEN: {
        message: messages_1.USERS_MESSAGES.INVALID_ACCESS_TOKEN,
        status: http_status_1.default.UNAUTHORIZED
    },
    REFRESH_TOKEN_REQUIRED: {
        message: messages_1.USERS_MESSAGES.REFRESH_TOKEN_REQUIRED,
        status: http_status_1.default.UNAUTHORIZED
    },
    INVALID_REFRESH_TOKEN: {
        message: messages_1.USERS_MESSAGES.INVALID_REFRESH_TOKEN,
        status: http_status_1.default.UNAUTHORIZED
    },
    USED_REFRESH_TOKEN_OR_NOT_EXISTS: {
        message: messages_1.USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXISTS,
        status: http_status_1.default.UNAUTHORIZED
    },
    EMAIL_ALREADY_VERIFIED_BEFORE: {
        message: messages_1.USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE,
        status: http_status_1.default.OK
    },
    INVALID_FORGOT_PASSWORD_TOKEN: {
        message: messages_1.USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
        status: http_status_1.default.UNAUTHORIZED
    },
    USER_NOT_VERIFIED: {
        message: messages_1.USERS_MESSAGES.USER_NOT_VERIFIED,
        status: http_status_1.default.FORBIDDEN
    },
    INVALID_USER_ID: {
        message: messages_1.USERS_MESSAGES.INVALID_USER_ID,
        status: http_status_1.default.NOT_FOUND
    },
    CANNOT_FOLLOW_YOURSELF: {
        message: messages_1.USERS_MESSAGES.CANNOT_FOLLOW_YOURSELF,
        status: http_status_1.default.BAD_REQUEST
    },
    CANNOT_UNFOLLOW_YOURSELF: {
        message: messages_1.USERS_MESSAGES.CANNOT_UNFOLLOW_YOURSELF,
        status: http_status_1.default.BAD_REQUEST
    },
    FOLLOWED_USER_NOT_FOUND: {
        message: messages_1.USERS_MESSAGES.FOLLOWED_USER_NOT_FOUND,
        status: http_status_1.default.NOT_FOUND
    },
    ALREADY_FOLLOWED_BEFORE: {
        message: messages_1.USERS_MESSAGES.ALREADY_FOLLOWED_BEFORE,
        status: http_status_1.default.CONFLICT
    },
    ALREADY_UNFOLLOWED_BEFORE: {
        message: messages_1.USERS_MESSAGES.ALREADY_UNFOLLOWED_BEFORE,
        status: http_status_1.default.CONFLICT
    },
    PASSWORD_NOT_MATCH: {
        message: messages_1.USERS_MESSAGES.PASSWORD_NOT_MATCH,
        status: http_status_1.default.BAD_REQUEST
    },
    EMAIL_REQUIRED: {
        message: messages_1.USERS_MESSAGES.EMAIL_REQUIRED,
        status: http_status_1.default.BAD_REQUEST
    },
    GMAIL_NOT_VERIFIED: {
        message: messages_1.USERS_MESSAGES.GMAIL_NOT_VERIFIED,
        status: http_status_1.default.BAD_REQUEST
    }
};
