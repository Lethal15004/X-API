"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserChangePasswordSchema = exports.UserUnfollowSchema = exports.UserFollowSchema = exports.UserUpdateSchema = exports.UserResetPasswordSchema = exports.UserVerifyForgotPasswordSchema = exports.UserForgotPasswordSchema = exports.UserVerifyEmailSchema = exports.UserLogoutSchema = exports.UserLoginSchema = exports.UserRegisterSchema = void 0;
const zod_1 = require("zod");
// Constants
const messages_1 = require("../../constants/messages");
const schemas_1 = require("../../constants/schemas");
const regex_1 = require("../../constants/regex");
// Define schema
exports.UserRegisterSchema = zod_1.z
    .object({
    name: schemas_1.nameSchema,
    email: schemas_1.emailSchema,
    password: schemas_1.passwordSchema,
    dateOfBirth: schemas_1.dateOfBirthSchema,
    confirm_password: schemas_1.confirmPasswordSchema,
    verifyStatus: schemas_1.verifyStatusOptional
})
    .strict()
    .refine((data) => data.password === data.confirm_password, {
    message: messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ['confirm_password']
});
exports.UserLoginSchema = zod_1.z
    .object({
    email: schemas_1.emailSchema,
    password: schemas_1.passwordSchema
})
    .strict();
exports.UserLogoutSchema = zod_1.z
    .object({
    refreshToken: schemas_1.refreshTokenSchema,
    authorization: schemas_1.accessTokenSchema
})
    .strict();
exports.UserVerifyEmailSchema = zod_1.z
    .object({
    emailVerifyToken: zod_1.z
        .string({
        required_error: messages_1.USERS_MESSAGES.VERIFY_EMAIL_TOKEN_REQUIRED
    })
        .nonempty(messages_1.USERS_MESSAGES.VERIFY_EMAIL_TOKEN_REQUIRED)
        .trim()
})
    .strict();
exports.UserForgotPasswordSchema = zod_1.z
    .object({
    email: schemas_1.emailSchema
})
    .strict();
exports.UserVerifyForgotPasswordSchema = zod_1.z
    .object({
    forgotPasswordToken: zod_1.z
        .string({
        required_error: messages_1.USERS_MESSAGES.VERIFY_PASSWORD_TOKEN_REQUIRED
    })
        .nonempty(messages_1.USERS_MESSAGES.VERIFY_PASSWORD_TOKEN_REQUIRED)
        .trim() // Xóa khoảng trắng ở đầu và cuối
})
    .strict();
exports.UserResetPasswordSchema = zod_1.z
    .object({
    forgotPasswordToken: zod_1.z
        .string({
        required_error: messages_1.USERS_MESSAGES.VERIFY_PASSWORD_TOKEN_REQUIRED
    })
        .nonempty(messages_1.USERS_MESSAGES.VERIFY_PASSWORD_TOKEN_REQUIRED)
        .trim(), // Xóa khoảng trắng ở đầu và cuối
    password: schemas_1.passwordSchema, // Xóa khoảng trắng ở đầu và cuối
    confirm_password: schemas_1.confirmPasswordSchema
})
    .strict()
    .refine((data) => data.password === data.confirm_password, {
    message: messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ['confirm_password']
});
exports.UserUpdateSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(3, messages_1.USERS_MESSAGES.NAME_TOO_SHORT).max(50, messages_1.USERS_MESSAGES.NAME_TOO_LONG).trim(), // Xóa khoảng trắng ở đầu và cuối
    dateOfBirth: schemas_1.dateOfBirthSchema,
    bio: zod_1.z.string().min(1, messages_1.USERS_MESSAGES.BIO_TOO_SHORT).max(255, messages_1.USERS_MESSAGES.BIO_TOO_LONG).trim(),
    location: zod_1.z.string().min(1, messages_1.USERS_MESSAGES.LOCATION_TOO_SHORT).max(255, messages_1.USERS_MESSAGES.LOCATION_TOO_LONG).trim(),
    website: zod_1.z.string().min(1, messages_1.USERS_MESSAGES.WEBSITE_TOO_SHORT).max(255, messages_1.USERS_MESSAGES.WEBSITE_TOO_LONG).trim(),
    username: zod_1.z
        .string()
        .min(3, messages_1.USERS_MESSAGES.USER_NAME_TOO_SHORT)
        .max(30, messages_1.USERS_MESSAGES.USER_NAME_TOO_LONG)
        .regex(regex_1.REGEX_USERNAME, messages_1.USERS_MESSAGES.USERNAME_INVALID),
    avatar: zod_1.z.string().min(1, messages_1.USERS_MESSAGES.AVATAR_TOO_SHORT).max(400, messages_1.USERS_MESSAGES.AVATAR_TOO_LONG).trim(),
    coverPhoto: zod_1.z
        .string()
        .min(1, messages_1.USERS_MESSAGES.COVER_PHOTO_TOO_SHORT)
        .max(400, messages_1.USERS_MESSAGES.COVER_PHOTO_TOO_LONG)
        .trim()
})
    .partial(); // optional
exports.UserFollowSchema = zod_1.z
    .object({
    followedUserId: schemas_1.userIdSchema
})
    .strict();
exports.UserUnfollowSchema = zod_1.z
    .object({
    unfollowedUserId: schemas_1.userIdSchema
})
    .strict();
exports.UserChangePasswordSchema = zod_1.z
    .object({
    oldPassword: schemas_1.passwordSchema,
    password: schemas_1.passwordSchema,
    confirm_password: schemas_1.confirmPasswordSchema
})
    .strict()
    .refine((data) => data.password === data.confirm_password, {
    message: messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ['confirm_password']
});
