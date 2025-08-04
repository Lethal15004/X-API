"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.UserService = void 0;
const inversify_1 = require("inversify");
const lodash_1 = require("lodash");
const axios_1 = __importDefault(require("axios"));
const mongodb_1 = require("mongodb");
// Config
const config_1 = require("../config/config");
// Utils
const bcryptPassword = __importStar(require("../utils/bcrypt.utils"));
const throw_errors_utils_1 = __importDefault(require("../utils/throw-errors.utils"));
const sanitize_utils_1 = __importDefault(require("../utils/sanitize.utils"));
// Constants
const types_1 = require("../constants/types");
const enums_1 = require("../constants/enums");
const db_tables_1 = require("../constants/db-tables");
// Class Service
let UserService = class UserService {
    PrismaService;
    AuthService;
    DEFAULT_USER_DATA = {
        bio: '',
        location: '',
        website: '',
        avatar: '',
        coverPhoto: '',
        emailVerifiedToken: '',
        forgotPasswordToken: '',
        verifyStatus: 0
    };
    REFRESH_TOKEN_EXPIRES = 100 * 24 * 60 * 60 * 1000;
    constructor(PrismaService, AuthService) {
        this.PrismaService = PrismaService;
        this.AuthService = AuthService;
    }
    async getMe(userId) {
        const user = await this.checkUserExist(userId);
        const newUser = (0, sanitize_utils_1.default)(user, ['password', 'emailVerifiedToken', 'forgotPasswordToken']);
        return newUser;
    }
    async getProfile(username) {
        const user = await this.PrismaService.findUnique(db_tables_1.DbTables.USERS, { username: username });
        if (!user) {
            (0, throw_errors_utils_1.default)('USER_NOT_FOUND');
        }
        const newUser = (0, sanitize_utils_1.default)(user, [
            'password',
            'emailVerifiedToken',
            'forgotPasswordToken',
            'verifyStatus',
            'createdAt',
            'updatedAt'
        ]);
        return newUser;
    }
    async oauth(code) {
        const { id_token, access_token } = await this.getOauthGoogleToken(code);
        const userInfo = await this.getGoogleUserInfo(access_token, id_token);
        if (!userInfo.verified_email) {
            (0, throw_errors_utils_1.default)('GMAIL_NOT_VERIFIED');
        }
        const isUserExist = await this.checkEmailExist(userInfo.email);
        if (isUserExist) {
            const { accessToken, refreshToken } = await this.createTokens(isUserExist.id, enums_1.UserVerifyStatus.Verified);
            await this.saveRefreshToken(refreshToken, isUserExist.id);
            return {
                accessToken,
                refreshToken,
                newUser: false,
                verify: isUserExist.verifyStatus
            };
        }
        else {
            const password = Math.random().toString(36).substring(2, 15);
            const data = await this.register({
                email: userInfo.email,
                name: userInfo.name,
                dateOfBirth: new Date(),
                password,
                confirm_password: password
            });
            return { ...(0, lodash_1.omit)(data, ['user']), newUser: true, verify: enums_1.UserVerifyStatus.Unverified };
        }
    }
    async updateMe(userId, payload) {
        const [isExistUser, userUpdated] = await Promise.all([
            this.PrismaService.findFirst(db_tables_1.DbTables.USERS, { id: userId }),
            this.PrismaService.update(db_tables_1.DbTables.USERS, { id: userId }, payload)
        ]);
        if (!isExistUser) {
            (0, throw_errors_utils_1.default)('USER_NOT_FOUND');
        }
        const newUser = (0, sanitize_utils_1.default)(userUpdated, ['password', 'emailVerifiedToken', 'forgotPasswordToken']);
        return newUser;
    }
    async register(user) {
        // Check if email already exists
        const isExist = await this.checkEmailExist(user.email);
        // Throw error if email already exists
        if (isExist) {
            (0, throw_errors_utils_1.default)('EMAIL_EXISTS');
        }
        const userId = new mongodb_1.ObjectId();
        const emailVerifiedToken = await this.createVerifyEmailToken(userId.toString(), enums_1.UserVerifyStatus.Unverified);
        const userData = {
            ...(0, lodash_1.omit)(user, ['confirm_password']),
            ...this.DEFAULT_USER_DATA,
            id: userId,
            emailVerifiedToken: emailVerifiedToken,
            password: bcryptPassword.hashPassword(user.password),
            username: `username_${userId}`
        };
        const newUser = await this.PrismaService.create(db_tables_1.DbTables.USERS, userData);
        const { accessToken, refreshToken } = await this.createTokens(newUser.id, enums_1.UserVerifyStatus.Unverified);
        // Insert refresh token
        await this.saveRefreshToken(refreshToken, newUser.id);
        return {
            user: newUser,
            accessToken,
            refreshToken
        };
    }
    async login(user) {
        const userExist = await this.checkEmailExist(user.email);
        // Throw error if email already exists
        if (!userExist) {
            (0, throw_errors_utils_1.default)('EMAIL_NOT_EXISTS');
        }
        // Check password
        this.checkPassword(user.password, userExist);
        const { accessToken, refreshToken } = await this.createTokens(userExist.id, userExist?.verifyStatus);
        // Insert refresh token
        await this.saveRefreshToken(refreshToken, userExist.id);
        return {
            user: userExist,
            accessToken,
            refreshToken
        };
    }
    async logout(refreshToken) {
        const isExist = await this.isExistRefreshToken(refreshToken);
        if (!isExist) {
            (0, throw_errors_utils_1.default)('USED_REFRESH_TOKEN_OR_NOT_EXISTS');
        }
        await this.PrismaService.deleteMany(db_tables_1.DbTables.REFRESH_TOKENS, { token: refreshToken });
        return true;
    }
    async emailVerify(decoded_email_verify_token) {
        const { userId } = decoded_email_verify_token;
        const user = await this.checkUserExist(userId);
        // If email verified
        if (user?.emailVerifiedToken === '') {
            (0, throw_errors_utils_1.default)('EMAIL_ALREADY_VERIFIED_BEFORE');
        }
        const [token] = await Promise.all([
            this.createTokens(userId, enums_1.UserVerifyStatus.Verified),
            await this.PrismaService.update(db_tables_1.DbTables.USERS, { id: userId }, { emailVerifiedToken: '', verifyStatus: enums_1.UserVerifyStatus.Verified })
        ]);
        const { accessToken, refreshToken } = token;
        return {
            accessToken,
            refreshToken
        };
    }
    async resendEmailVerify(decoded_authorization) {
        const { userId } = decoded_authorization;
        const user = await this.checkUserExist(userId);
        // If email verified
        if (user?.verifyStatus === enums_1.UserVerifyStatus.Verified) {
            (0, throw_errors_utils_1.default)('EMAIL_ALREADY_VERIFIED_BEFORE');
        }
        const emailVerifiedToken = await this.createVerifyEmailToken(userId, enums_1.UserVerifyStatus.Unverified);
        // Fake send email
        console.log('Resend verify email: ', emailVerifiedToken);
        // Update
        await this.PrismaService.update(db_tables_1.DbTables.USERS, { id: userId }, { emailVerifiedToken: emailVerifiedToken });
        return emailVerifiedToken;
    }
    async forgotPassword(email) {
        const userExist = await this.checkEmailExist(email);
        const forgotPasswordToken = await this.createForgotPasswordToken(userExist?.id, userExist?.verifyStatus);
        await this.PrismaService.update(db_tables_1.DbTables.USERS, { id: userExist?.id }, { forgotPasswordToken: forgotPasswordToken });
        // Send Email with email User: https://twitter.com/forgot-password?token=token
        console.log('forgot password token: ', forgotPasswordToken);
        return true;
    }
    async forgotPasswordVerify(decoded_forgot_password_verify_token, forgotPasswordToken) {
        const { userId } = decoded_forgot_password_verify_token;
        const user = await this.checkUserExist(userId);
        if (user?.forgotPasswordToken !== forgotPasswordToken) {
            (0, throw_errors_utils_1.default)('INVALID_FORGOT_PASSWORD_TOKEN');
        }
        return true;
    }
    async resetPassword(decoded_forgot_password_verify_token, forgotPasswordToken, password) {
        const { userId } = decoded_forgot_password_verify_token;
        const user = await this.checkUserExist(userId);
        if (user?.forgotPasswordToken !== forgotPasswordToken) {
            (0, throw_errors_utils_1.default)('INVALID_FORGOT_PASSWORD_TOKEN');
        }
        await this.PrismaService.update(db_tables_1.DbTables.USERS, { id: user?.id }, { forgotPasswordToken: '', password: bcryptPassword.hashPassword(password) });
        return true;
    }
    async follow(followedUserId, decoded_authorization) {
        const currentUserId = decoded_authorization.userId;
        const { followRelation } = await this.validateFollowOperation(followedUserId, currentUserId, 'follow');
        if (followRelation) {
            (0, throw_errors_utils_1.default)('ALREADY_FOLLOWED_BEFORE');
        }
        await this.PrismaService.create(db_tables_1.DbTables.FOLLOWERS, {
            userId: currentUserId,
            followedUserId: followedUserId
        });
        return true;
    }
    async unfollow(unfollowedUserId, decoded_authorization) {
        const currentUserId = decoded_authorization.userId;
        const { followRelation } = await this.validateFollowOperation(unfollowedUserId, currentUserId, 'unfollow');
        if (!followRelation) {
            (0, throw_errors_utils_1.default)('ALREADY_UNFOLLOWED_BEFORE');
        }
        await this.PrismaService.deleteFirst(db_tables_1.DbTables.FOLLOWERS, {
            id: followRelation?.id
        });
        return true;
    }
    async changePassword(oldPassword, newPassword, userId) {
        const user = await this.checkUserExist(userId);
        if (!bcryptPassword.verifyPassword(oldPassword, user?.password)) {
            (0, throw_errors_utils_1.default)('PASSWORD_NOT_MATCH');
        }
        const hashedNewPassword = bcryptPassword.hashPassword(newPassword);
        await this.PrismaService.update(db_tables_1.DbTables.USERS, { id: userId }, { password: hashedNewPassword });
        return true;
    }
    // Functions help for service
    async checkEmailExist(email) {
        const isExist = await this.PrismaService.findUnique(db_tables_1.DbTables.USERS, { email });
        return isExist;
    }
    checkPassword(password, userExist) {
        const isMatch = bcryptPassword.verifyPassword(password, userExist.password);
        if (!isMatch) {
            (0, throw_errors_utils_1.default)('PASSWORD_INCORRECT');
        }
    }
    async checkUserExist(userId) {
        const user = await this.PrismaService.findUnique(db_tables_1.DbTables.USERS, { id: userId });
        if (!user) {
            (0, throw_errors_utils_1.default)('USER_NOT_FOUND');
        }
        return user;
    }
    async createTokens(userId, verifyStatus) {
        const [accessToken, refreshToken] = await Promise.all([
            this.AuthService.signAccessToken({
                userId,
                tokenType: enums_1.TokenType.AccessToken,
                verifyStatus: verifyStatus
            }),
            this.AuthService.signRefreshToken({
                userId,
                tokenType: enums_1.TokenType.RefreshToken,
                verifyStatus: verifyStatus
            })
        ]);
        return { accessToken, refreshToken };
    }
    async createVerifyEmailToken(userId, verifyStatus) {
        const emailVerifiedToken = await this.AuthService.signEmailVerifyToken({
            userId: userId.toString(),
            tokenType: enums_1.TokenType.EmailVerifyToken,
            verifyStatus: verifyStatus
        });
        return emailVerifiedToken;
    }
    async createForgotPasswordToken(userId, verifyStatus) {
        const forgotPasswordToken = await this.AuthService.signForgotPasswordToken({
            userId: userId.toString(),
            tokenType: enums_1.TokenType.ForgotPasswordToken,
            verifyStatus: verifyStatus
        });
        return forgotPasswordToken;
    }
    async saveRefreshToken(refreshToken, userId) {
        await this.PrismaService.create(db_tables_1.DbTables.REFRESH_TOKENS, {
            expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRES),
            token: refreshToken,
            userId
        });
    }
    async isExistRefreshToken(refreshToken) {
        return await this.PrismaService.findFirst(db_tables_1.DbTables.REFRESH_TOKENS, { token: refreshToken });
    }
    async validateFollowOperation(targetUserId, currentUserId, type) {
        if (!mongodb_1.ObjectId.isValid(targetUserId)) {
            (0, throw_errors_utils_1.default)('INVALID_USER_ID');
        }
        if (targetUserId == currentUserId) {
            if (type == 'follow') {
                (0, throw_errors_utils_1.default)('CANNOT_FOLLOW_YOURSELF');
            }
            else {
                (0, throw_errors_utils_1.default)('CANNOT_UNFOLLOW_YOURSELF');
            }
        }
        const [currentUser, targetUser, followRelation] = await Promise.all([
            this.PrismaService.findUnique(db_tables_1.DbTables.USERS, { id: currentUserId }),
            this.PrismaService.findUnique(db_tables_1.DbTables.USERS, { id: targetUserId }),
            this.PrismaService.findFirst(db_tables_1.DbTables.FOLLOWERS, {
                userId: currentUserId,
                followedUserId: targetUserId
            })
        ]);
        if (!targetUser || !currentUser) {
            (0, throw_errors_utils_1.default)('USER_NOT_FOUND');
        }
        return { targetUser, followRelation };
    }
    // Get Token from Google
    async getOauthGoogleToken(code) {
        const params = new URLSearchParams();
        params.append('code', code);
        params.append('client_id', process.env.GOOGLE_CLIENT_ID);
        params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
        params.append('redirect_uri', config_1.isProduction ? process.env.GOOGLE_REDIRECT_URI_PRODUCTION : process.env.GOOGLE_REDIRECT_URI);
        const redirectUri = config_1.isProduction ? process.env.GOOGLE_REDIRECT_URI_PRODUCTION : process.env.GOOGLE_REDIRECT_URI;
        console.log('Using redirect URI:', redirectUri);
        params.append('grant_type', 'authorization_code');
        // Post to google with properly encoded form data
        const { data } = await axios_1.default.post('https://oauth2.googleapis.com/token', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return data;
    }
    async getGoogleUserInfo(access_token, id_token) {
        const { data } = await axios_1.default.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            params: {
                access_token,
                alt: 'json'
            },
            headers: {
                Authorization: `Bearer ${id_token}`
            }
        });
        return data;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES_SERVICE.PrismaService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES_SERVICE.AuthService)),
    __metadata("design:paramtypes", [Object, Object])
], UserService);
