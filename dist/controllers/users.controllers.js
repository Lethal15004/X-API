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
// Configs
const config_1 = require("../config/config");
// Constants
const messages_1 = require("../constants/messages");
const http_status_1 = __importDefault(require("../constants/http-status"));
const types_1 = require("../constants/types");
let UserController = class UserController {
    UserService;
    constructor(UserService) {
        this.UserService = UserService;
    }
    pageRegisterGoogle = async (req, res) => {
        res.render('pages/oauth-google', {
            title: 'Sign in with Google - Twitter API'
        });
    };
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
                id: userExist.user.id,
                accessToken: userExist.accessToken,
                refreshToken: userExist.refreshToken,
                emailVerifyToken: userExist.user.emailVerifiedToken
            });
        }
        else {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: messages_1.USERS_MESSAGES.REGISTER_FAILED });
        }
    };
    redirectToGoogle = async (req, res) => {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const redirectUri = (config_1.isProduction ? process.env.GOOGLE_REDIRECT_URI_PRODUCTION : process.env.GOOGLE_REDIRECT_URI) || '';
        const options = {
            redirect_uri: redirectUri,
            client_id: process.env.GOOGLE_CLIENT_ID || '',
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ].join(' ')
        };
        const url = `${rootUrl}?${new URLSearchParams(options).toString()}`;
        return res.redirect(url);
    };
    oauth = async (req, res) => {
        const { code, state } = req.query;
        if (!code) {
            res.status(400).json({ message: 'Authorization code is required' });
        }
        try {
            const result = await this.UserService.oauth(code);
            const referer = req.headers.referer || '';
            const isSwaggerRedirect = referer.includes('oauth2-redirect.html') || req.query.state?.toString().includes('swagger');
            if (isSwaggerRedirect) {
                const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Authentication Successful</title>
        </head>
        <body>
          <script>
            // This script will run in the oauth2-redirect.html context
            window.onload = function() {
              // Create URL with fragment containing the token
              const redirectUrl = window.location.origin + '/api-docs/oauth2-redirect.html'
                  + '#access_token=${result.accessToken}'
                  + '&token_type=Bearer'
                  + '&state=${req.query.state || ''}'
                  + '&expires_in=3600'
                  + '&scope=email%20profile';
              
              // Redirect to the Swagger UI oauth2-redirect handler
              window.location.href = redirectUrl;
            }
          </script>
          <p>Authenticating...</p>
        </body>
        </html>
      `;
                res.setHeader('Content-Type', 'text/html');
                res.send(html);
            }
            else {
                const html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>Authentication Successful</title>
                      <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 30px; }
                        .token-box { background: #f5f5f5; padding: 15px; margin: 20px auto; border-radius: 5px; word-break: break-all; text-align: left; }
                        .copy-btn { background: #4285f4; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px; }
                        .back-btn { background: #333; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 20px; transition: background-color 0.3s; }
                        .back-btn:hover { background: #555; }
                        .buttons-container { margin: 20px 0; }
                      </style>
                    </head>
                    <body>
                      <h2>Authentication Successful! 🎉</h2>
                      <p>Your access token:</p>
                      <div class="token-box" id="token">${result.accessToken}</div>
                      
                      <div class="buttons-container">
                        <button class="copy-btn" onclick="copyToken()">Copy Token</button>
                        <a class="back-btn" href="/users/register-google">Back to Login</a>
                      </div>
                      
                      <p>Please copy this token and paste it into the bearerAuth field in Swagger UI.</p>
                      
                      <script>
                        function copyToken() {
                          const tokenText = document.getElementById('token').innerText;
                          navigator.clipboard.writeText(tokenText)
                            .then(() => alert('Token copied to clipboard!'))
                            .catch(err => console.error('Error copying token:', err));
                        }
                      </script>
                    </body>
                    </html>
                    `;
                res.setHeader('Content-Type', 'text/html');
                res.setHeader('Cache-Control', 'no-store');
                res.send(html);
            }
        }
        catch (error) {
            console.error('OAuth error details:', error);
            res.status(401).json({
                message: 'Authentication failed',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    };
    login = async (req, res) => {
        const userExist = await this.UserService.login(req.body);
        if (userExist) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.USERS_MESSAGES.LOGIN_SUCCESS,
                id: userExist.user.id,
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
