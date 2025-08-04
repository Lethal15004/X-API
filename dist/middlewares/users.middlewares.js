"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMiddleware = void 0;
const inversify_1 = require("inversify");
// Constants
const types_1 = require("../constants/types");
const enums_1 = require("../constants/enums");
const http_status_1 = __importDefault(require("../constants/http-status"));
// Utils
const throw_errors_utils_1 = __importDefault(require("../utils/throw-errors.utils"));
const split_token_utils_1 = require("../utils/split-token.utils");
// Schemas
const users_schemas_1 = require("../models/schemas/users.schemas");
const Errors_1 = require("../models/Errors");
/**
 * Middleware run validation by Zod
 * @param schema - Schema of Zod to validate
 */
let UserMiddleware = class UserMiddleware {
    AuthService;
    constructor(AuthService) {
        this.AuthService = AuthService;
    }
    defaultValidator = (schema, source = 'body') => {
        return async (req, res, next) => {
            req.body = await schema.parseAsync(req[source]);
            next();
        };
    };
    logOutValidator = (source = 'body') => {
        return async (req, res, next) => {
            const { authorization } = req.headers;
            const { refreshToken } = req[source];
            const rs = await users_schemas_1.UserLogoutSchema.safeParseAsync({ authorization, refreshToken });
            if (!rs.success) {
                throw new Errors_1.ErrorWithStatus({
                    message: rs.error.errors[0].message,
                    status: http_status_1.default.UNAUTHORIZED
                }); // Quăng lỗi đầu tiên
            }
            const [decoded_authorization, decoded_refreshToken] = await this.decodeAccessRefreshToken(rs.data.authorization, rs.data.refreshToken);
            req.decoded_refresh_token = decoded_refreshToken;
            req.decoded_authorization = decoded_authorization;
            next();
        };
    };
    verifyEmailValidator = (source = 'body') => {
        return async (req, res, next) => {
            const { emailVerifyToken } = req[source];
            const rs = await users_schemas_1.UserVerifyEmailSchema.safeParseAsync({ emailVerifyToken });
            if (!rs.success) {
                throw new Errors_1.ErrorWithStatus({
                    message: rs.error.errors[0].message,
                    status: http_status_1.default.UNAUTHORIZED
                }); // Quăng lỗi đầu tiên
            }
            const decoded_email_verify_token = await this.decodeEmailVerifyToken(rs.data.emailVerifyToken);
            req.decoded_email_verify_token = decoded_email_verify_token;
            next();
        };
    };
    verifyForgotPasswordValidator = (source = 'body') => {
        return async (req, res, next) => {
            const { forgotPasswordToken } = req[source];
            const rs = await users_schemas_1.UserVerifyForgotPasswordSchema.safeParseAsync({ forgotPasswordToken });
            if (!rs.success) {
                throw new Errors_1.ErrorWithStatus({
                    message: rs.error.errors[0].message,
                    status: http_status_1.default.UNAUTHORIZED
                }); // Quăng lỗi đầu tiên
            }
            const decoded_forgot_password_verify_token = await this.decodeForgotPasswordVerifyToken(rs.data.forgotPasswordToken);
            req.decoded_forgot_password_verify_token = decoded_forgot_password_verify_token;
            next();
        };
    };
    resetPasswordValidator = (source = 'body') => {
        return async (req, res, next) => {
            const rs = await users_schemas_1.UserResetPasswordSchema.safeParseAsync(req[source]);
            if (!rs.success) {
                throw new Errors_1.ErrorWithStatus({
                    message: rs.error.errors[0].message,
                    status: http_status_1.default.UNAUTHORIZED
                }); // Quăng lỗi đầu tiên
            }
            const decoded_forgot_password_verify_token = await this.decodeForgotPasswordVerifyToken(rs.data.forgotPasswordToken);
            req.decoded_forgot_password_verify_token = decoded_forgot_password_verify_token;
            next();
        };
    };
    accessTokenValidator = (source = 'headers') => {
        return async (req, res, next) => {
            const { authorization } = req.headers;
            if (!authorization) {
                (0, throw_errors_utils_1.default)('ACCESS_TOKEN_REQUIRED');
            }
            const splitAuthorization = (0, split_token_utils_1.splitAccessToken)(authorization);
            const decoded_authorization = await this.decodeAccessToken(splitAuthorization);
            req.decoded_authorization = decoded_authorization;
            next();
        };
    };
    verifiedUserValidator = async (req, res, next) => {
        const { verifyStatus } = req.decoded_authorization;
        if (verifyStatus !== enums_1.UserVerifyStatus.Verified) {
            (0, throw_errors_utils_1.default)('USER_NOT_VERIFIED');
        }
        next();
    };
    async decodeAccessRefreshToken(authorization, refreshToken) {
        return await Promise.all([
            this.AuthService.verifyToken(authorization, enums_1.TokenType.AccessToken),
            this.AuthService.verifyToken(refreshToken, enums_1.TokenType.RefreshToken)
        ]);
    }
    async decodeAccessToken(authorization) {
        return await this.AuthService.verifyToken(authorization, enums_1.TokenType.AccessToken);
    }
    async decodeRefreshToken(refreshToken) {
        return await this.AuthService.verifyToken(refreshToken, enums_1.TokenType.RefreshToken);
    }
    async decodeEmailVerifyToken(emailVerifyToken) {
        return await this.AuthService.verifyToken(emailVerifyToken, enums_1.TokenType.EmailVerifyToken);
    }
    async decodeForgotPasswordVerifyToken(forgotPasswordToken) {
        return await this.AuthService.verifyToken(forgotPasswordToken, enums_1.TokenType.ForgotPasswordToken);
    }
};
exports.UserMiddleware = UserMiddleware;
exports.UserMiddleware = UserMiddleware = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES_SERVICE.AuthService)),
    __metadata("design:paramtypes", [Object])
], UserMiddleware);
