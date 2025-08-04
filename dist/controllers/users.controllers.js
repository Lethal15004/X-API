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
            // Create HTML to apply token
            const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Successful</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 30px; }
          .token-box { background: #f5f5f5; padding: 15px; margin: 20px auto; border-radius: 5px; word-break: break-all; }
          button { background: #4285f4; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        </style>
      </head>
      <body>
        <h2>Authentication Successful! 🎉</h2>
        <p>Your access token:</p>
        <div class="token-box">${result.accessToken}</div>
        
        <button id="applyToken">Apply Token & Close</button>
        <p>Click the button above to automatically apply this token to Swagger UI.</p>
        
        <script>
          // Get token and opener window (Swagger UI)
          const token = "${result.accessToken}";
          const opener = window.opener;
          
          // Function to apply token to Swagger UI
          function applyTokenToSwagger() {
            if (opener) {
              // Find bearerAuth input in the parent window
              const inputElement = opener.document.querySelector('input[type="text"][data-component="security-definition-bearer-value"]');
              
              if (inputElement) {
                // Set token value
                inputElement.value = token;
                
                // Find and click the Authorize button
                const authorizeButton = inputElement.closest('.modal-ux').querySelector('.auth-btn-wrapper button.btn');
                if (authorizeButton) {
                  authorizeButton.click();
                }
                
                // Close this popup
                window.close();
              } else {
                alert("Couldn't find bearerAuth input in Swagger UI. Please copy and paste the token manually.");
              }
            }
          }
          
          // Add click event for the button
          document.getElementById('applyToken').addEventListener('click', applyTokenToSwagger);
        </script>
      </body>
      </html>
    `;
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
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
