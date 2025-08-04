"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../container"));
const router = (0, express_1.Router)();
// Controllers
const users_controllers_1 = require("../controllers/users.controllers");
// Middlewares
const users_middlewares_1 = require("../middlewares/users.middlewares");
// Schemas
const users_schemas_1 = require("../models/schemas/users.schemas");
// Utils
const handlers_utils_1 = __importDefault(require("../utils/handlers.utils"));
// Get controllers and middlewares
const userController = container_1.default.get(users_controllers_1.UserController);
const userMiddleware = container_1.default.get(users_middlewares_1.UserMiddleware);
router.get('/me', (0, handlers_utils_1.default)(userMiddleware.accessTokenValidator()), (0, handlers_utils_1.default)(userController.getMe));
router.get('/oauth/google', (0, handlers_utils_1.default)(userController.redirectToGoogle));
router.get('/oauth/google/callback', (0, handlers_utils_1.default)(userController.oauth));
router.get('/register-google', userController.pageRegisterGoogle);
router.get('/:username', (0, handlers_utils_1.default)(userController.getProfile));
router.patch('/me', (0, handlers_utils_1.default)(userMiddleware.accessTokenValidator()), (0, handlers_utils_1.default)(userMiddleware.verifiedUserValidator), (0, handlers_utils_1.default)(userMiddleware.defaultValidator(users_schemas_1.UserUpdateSchema)), (0, handlers_utils_1.default)(userController.updateMe));
router.post('/register', (0, handlers_utils_1.default)(userMiddleware.defaultValidator(users_schemas_1.UserRegisterSchema)), (0, handlers_utils_1.default)(userController.register));
router.post('/login', (0, handlers_utils_1.default)(userMiddleware.defaultValidator(users_schemas_1.UserLoginSchema)), (0, handlers_utils_1.default)(userController.login));
router.post('/logout', (0, handlers_utils_1.default)(userMiddleware.logOutValidator()), (0, handlers_utils_1.default)(userController.logout));
router.post('/verify-email/:emailVerifyToken', (0, handlers_utils_1.default)(userMiddleware.verifyEmailValidator('params')), (0, handlers_utils_1.default)(userController.emailVerify));
router.post('/resend-verify-email', (0, handlers_utils_1.default)(userMiddleware.accessTokenValidator()), (0, handlers_utils_1.default)(userController.resendEmailVerify));
router.post('/forgot-password', (0, handlers_utils_1.default)(userMiddleware.defaultValidator(users_schemas_1.UserForgotPasswordSchema)), (0, handlers_utils_1.default)(userController.forgotPassword));
router.post('/verify-forgot-password', (0, handlers_utils_1.default)(userMiddleware.verifyForgotPasswordValidator()), (0, handlers_utils_1.default)(userController.verifyForgotPassword));
router.post('/reset-password', (0, handlers_utils_1.default)(userMiddleware.resetPasswordValidator()), (0, handlers_utils_1.default)(userController.resetPassword));
router.post('/follow/:followedUserId', (0, handlers_utils_1.default)(userMiddleware.accessTokenValidator()), (0, handlers_utils_1.default)(userMiddleware.verifiedUserValidator), (0, handlers_utils_1.default)(userMiddleware.defaultValidator(users_schemas_1.UserFollowSchema, 'params')), (0, handlers_utils_1.default)(userController.follow));
router.delete('/unfollow/:unfollowedUserId', (0, handlers_utils_1.default)(userMiddleware.accessTokenValidator()), (0, handlers_utils_1.default)(userMiddleware.verifiedUserValidator), (0, handlers_utils_1.default)(userMiddleware.defaultValidator(users_schemas_1.UserUnfollowSchema, 'params')), (0, handlers_utils_1.default)(userController.unfollow));
router.put('/change-password', (0, handlers_utils_1.default)(userMiddleware.accessTokenValidator()), (0, handlers_utils_1.default)(userMiddleware.verifiedUserValidator), (0, handlers_utils_1.default)(userMiddleware.defaultValidator(users_schemas_1.UserChangePasswordSchema)), (0, handlers_utils_1.default)(userController.changePassword));
exports.default = router;
