"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const inversify_1 = require("inversify");
// Constants
const enums_1 = require("../constants/enums");
let AuthService = class AuthService {
    JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;
    JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN;
    JWT_SECRET_VERIFY_EMAIL = process.env.JWT_SECRET_VERIFY_EMAIL;
    JWT_SECRET_FORGOT_PASSWORD = process.env.JWT_SECRET_FORGOT_PASSWORD;
    signAccessToken(payload) {
        return this.signToken(payload, this.JWT_SECRET_ACCESS_TOKEN, {
            algorithm: 'HS256',
            expiresIn: '30m'
        });
    }
    signRefreshToken(payload) {
        return this.signToken(payload, this.JWT_SECRET_REFRESH_TOKEN, {
            algorithm: 'HS256',
            expiresIn: '100d'
        });
    }
    signEmailVerifyToken(payload) {
        return this.signToken(payload, this.JWT_SECRET_VERIFY_EMAIL, {
            algorithm: 'HS256',
            expiresIn: '7d'
        });
    }
    signForgotPasswordToken(payload) {
        return this.signToken(payload, this.JWT_SECRET_FORGOT_PASSWORD, {
            algorithm: 'HS256',
            expiresIn: '7d'
        });
    }
    async verifyToken(token, type) {
        let privateKey;
        switch (type) {
            case enums_1.TokenType.AccessToken:
                privateKey = this.JWT_SECRET_ACCESS_TOKEN;
                break;
            case enums_1.TokenType.RefreshToken:
                privateKey = this.JWT_SECRET_REFRESH_TOKEN;
                break;
            case enums_1.TokenType.EmailVerifyToken:
                privateKey = this.JWT_SECRET_VERIFY_EMAIL;
                break;
            case enums_1.TokenType.ForgotPasswordToken:
                privateKey = this.JWT_SECRET_FORGOT_PASSWORD;
                break;
            default:
                throw new Error('Invalid token type');
        }
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, privateKey, (err, decoded) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(decoded);
            });
        });
    }
    async signToken(payload, secret, options) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.sign(payload, secret, options, (err, token) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(token);
            });
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)()
], AuthService);
