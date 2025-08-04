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
exports.UserController = void 0;
const inversify_1 = require("inversify");
// Constants
const messages_1 = require("../constants/messages");
const http_status_1 = __importDefault(require("../constants/http-status"));
const types_1 = require("../constants/types");
let UserController = class UserController {
    UserService;
    constructor(UserService) {
        this.UserService = UserService;
    }
    getMe = async (req, res) => {
        const user = await this.UserService.getMe(req.decoded_authorization?.userId);
        if (user) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.GET_ME_SUCCESS,
                user: user
            });
        }
        else {
            res.status(http_status_1.default.UNAUTHORIZED).json({
                message: messages_1.USERS_MESSAGES.GET_ME_FAILED
            });
        }
    };
    getProfile = async (req, res) => {
        const { username } = req.params;
        const user = await this.UserService.getProfile(username);
        if (user) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.GET_PROFILE_SUCCESS,
                user: user
            });
        }
        else {
            res.status(http_status_1.default.BAD_REQUEST).json({
                message: messages_1.USERS_MESSAGES.GET_PROFILE_FAILED
            });
        }
    };
    updateMe = async (req, res) => {
        const user = await this.UserService.updateMe(req.decoded_authorization?.userId, req.body);
        if (user) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.UPDATE_SUCCESS,
                user: user
            });
        }
        else {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: messages_1.USERS_MESSAGES.UPDATE_FAILED });
        }
    };
    register = async (req, res) => {
        const userExist = await this.UserService.register(req.body);
        if (userExist) {
            res.status(http_status_1.default.CREATED).json({
                message: messages_1.USERS_MESSAGES.REGISTER_SUCCESS,
                accessToken: userExist.accessToken,
                refreshToken: userExist.refreshToken,
                emailVerifyToken: userExist.user.emailVerifiedToken
            });
        }
        else {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: messages_1.USERS_MESSAGES.REGISTER_FAILED });
        }
    };
    oauth = async (req, res) => {
        const { code, state } = req.query;
        if (!code) {
            res.status(400).json({ message: 'Authorization code is required' });
        }
        try {
            const result = await this.UserService.oauth(code);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('OAuth error:', error);
            res.status(401).json({ message: 'Authentication failed', error });
        }
    };
    login = async (req, res) => {
        const userExist = await this.UserService.login(req.body);
        if (userExist) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.LOGIN_SUCCESS,
                accessToken: userExist.accessToken,
                refreshToken: userExist.refreshToken
            });
        }
        else {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: messages_1.USERS_MESSAGES.LOGIN_FAILED });
        }
    };
    logout = async (req, res) => {
        const { refreshToken } = req.body;
        const result = await this.UserService.logout(refreshToken);
        if (result) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.LOGOUT_SUCCESS
            });
        }
        else {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: messages_1.USERS_MESSAGES.LOGOUT_FAILED });
        }
    };
    emailVerify = async (req, res) => {
        const result = await this.UserService.emailVerify(req.decoded_email_verify_token);
        if (result) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.VERIFIED_EMAIL_SUCCESS
            });
        }
        else {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: messages_1.USERS_MESSAGES.VERIFIED_EMAIL_FAILED });
        }
    };
    resendEmailVerify = async (req, res) => {
        const emailVerifyToken = await this.UserService.resendEmailVerify(req.decoded_authorization);
        if (emailVerifyToken) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS,
                emailVerifyToken: emailVerifyToken
            });
        }
        else {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: messages_1.USERS_MESSAGES.RESEND_VERIFY_EMAIL_FAILED });
        }
    };
    forgotPassword = async (req, res) => {
        const { email } = req.body;
        const result = await this.UserService.forgotPassword(email);
        if (result) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
            });
        }
        else {
            res.status(http_status_1.default.BAD_REQUEST).json({
                message: messages_1.USERS_MESSAGES.EMAIL_TO_RESET_PASSWORD_FAILED
            });
        }
    };
    verifyForgotPassword = async (req, res) => {
        const result = await this.UserService.forgotPasswordVerify(req.decoded_forgot_password_verify_token, req.body.forgotPasswordToken);
        if (result) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.VERIFIED_FORGOT_PASSWORD_SUCCESS
            });
        }
        else {
            res.status(http_status_1.default.BAD_REQUEST).json({
                message: messages_1.USERS_MESSAGES.VERIFIED_FORGOT_PASSWORD_FAILED
            });
        }
    };
    resetPassword = async (req, res) => {
        const result = await this.UserService.resetPassword(req.decoded_forgot_password_verify_token, req.body.forgotPasswordToken, req.body.password);
        if (result) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.RESET_PASSWORD_SUCCESS
            });
        }
        else {
            res.status(http_status_1.default.UNAUTHORIZED).json({
                message: messages_1.USERS_MESSAGES.RESET_PASSWORD_FAILED
            });
        }
    };
    follow = async (req, res) => {
        const result = await this.UserService.follow(req.params.followedUserId, req.decoded_authorization);
        if (result) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.FOLLOW_SUCCESS
            });
        }
        else {
            res.status(http_status_1.default.UNAUTHORIZED).json({
                message: messages_1.USERS_MESSAGES.FOLLOW_FAILED
            });
        }
    };
    unfollow = async (req, res) => {
        const result = await this.UserService.unfollow(req.params.unfollowedUserId, req.decoded_authorization);
        if (result) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.UNFOLLOW_SUCCESS
            });
        }
        else {
            res.status(http_status_1.default.UNAUTHORIZED).json({
                message: messages_1.USERS_MESSAGES.UNFOLLOW_FAILED
            });
        }
    };
    changePassword = async (req, res) => {
        const result = await this.UserService.changePassword(req.body.oldPassword, req.body.password, req.decoded_authorization?.userId);
        if (result) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS
            });
        }
        else {
            res.status(http_status_1.default.UNAUTHORIZED).json({
                message: messages_1.USERS_MESSAGES.CHANGE_PASSWORD_FAILED
            });
        }
    };
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES_SERVICE.UserService)),
    __metadata("design:paramtypes", [Object])
], UserController);
