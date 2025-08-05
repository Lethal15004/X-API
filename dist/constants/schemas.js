"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameVideo = exports.nameImage = exports.userIdSchema = exports.accessTokenSchema = exports.refreshTokenSchema = exports.dateOfBirthSchema = exports.nameSchema = exports.verifyStatusOptional = exports.confirmPasswordSchema = exports.emailSchema = exports.passwordSchema = void 0;
const zod_1 = require("zod");
// Constants
const messages_1 = require("../constants/messages");
// Define schema for help
// 1. Users
exports.passwordSchema = zod_1.z
    .string({
    required_error: messages_1.USERS_MESSAGES.PASSWORD_REQUIRED
})
    .min(8, messages_1.USERS_MESSAGES.PASSWORD_TOO_SHORT)
    .max(255, messages_1.USERS_MESSAGES.PASSWORD_TOO_LONG)
    .nonempty(messages_1.USERS_MESSAGES.PASSWORD_CANNOT_BE_EMPTY)
    .trim();
exports.emailSchema = zod_1.z
    .string({
    required_error: messages_1.USERS_MESSAGES.EMAIL_REQUIRED
})
    .email(messages_1.USERS_MESSAGES.INVALID_EMAIL_FORMAT)
    .nonempty(messages_1.USERS_MESSAGES.EMAIL_CANNOT_BE_EMPTY)
    .trim();
exports.confirmPasswordSchema = zod_1.z
    .string({
    required_error: messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_REQUIRED
})
    .min(8, messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_TOO_SHORT)
    .max(255, messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_TOO_LONG)
    .nonempty(messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_CANNOT_BE_EMPTY);
exports.verifyStatusOptional = zod_1.z.number().default(0).optional();
exports.nameSchema = zod_1.z
    .string({
    required_error: messages_1.USERS_MESSAGES.NAME_REQUIRED
})
    .min(3, messages_1.USERS_MESSAGES.NAME_TOO_SHORT)
    .max(50, messages_1.USERS_MESSAGES.NAME_TOO_LONG)
    .nonempty(messages_1.USERS_MESSAGES.NAME_CANNOT_BE_EMPTY)
    .trim(); // Xóa khoảng trắng ở đầu và cuối
exports.dateOfBirthSchema = zod_1.z
    .string({ required_error: messages_1.USERS_MESSAGES.DATE_REQUIRED })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: messages_1.USERS_MESSAGES.INVALID_DATE_FORMAT
})
    .transform((val) => new Date(`${val}T00:00:00.000Z`));
exports.refreshTokenSchema = zod_1.z
    .string({
    required_error: messages_1.USERS_MESSAGES.REFRESH_TOKEN_REQUIRED
})
    .nonempty(messages_1.USERS_MESSAGES.REFRESH_TOKEN_REQUIRED);
exports.accessTokenSchema = zod_1.z
    .string({
    required_error: messages_1.USERS_MESSAGES.ACCESS_TOKEN_REQUIRED
})
    .nonempty(messages_1.USERS_MESSAGES.ACCESS_TOKEN_REQUIRED)
    .regex(/^Bearer\s+/, {
    message: messages_1.USERS_MESSAGES.INVALID_ACCESS_TOKEN
})
    .transform((bearer) => bearer.split(' ')[1]);
exports.userIdSchema = zod_1.z
    .string({
    required_error: messages_1.USERS_MESSAGES.FOLLOW_USER_ID_REQUIRED
})
    .nonempty(messages_1.USERS_MESSAGES.FOLLOW_USER_ID_REQUIRED)
    .trim(); // Xóa khoảng trắng ở đầu và cuối
// 2. Static
exports.nameImage = zod_1.z
    .string({
    required_error: messages_1.MEDIAS_MESSAGES.FILE_NOT_FOUND
})
    .nonempty(messages_1.MEDIAS_MESSAGES.FILE_NOT_FOUND)
    .trim();
exports.nameVideo = zod_1.z
    .string({
    required_error: messages_1.MEDIAS_MESSAGES.FILE_NOT_FOUND
})
    .nonempty(messages_1.MEDIAS_MESSAGES.FILE_NOT_FOUND)
    .trim();
