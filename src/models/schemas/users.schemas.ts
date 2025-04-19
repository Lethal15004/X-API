import { z } from 'zod'

// Constants
import USERS_MESSAGES from '~/constants/messages'
import {
  nameSchema,
  userIdSchema,
  dateOfBirthSchema,
  passwordSchema,
  emailSchema,
  confirmPasswordSchema,
  refreshTokenSchema,
  accessTokenSchema
} from '~/constants/schemas'
import { REGEX_USERNAME } from '~/constants/regex'

// Define schema
export const UserRegisterSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    dateOfBirth: dateOfBirthSchema,
    confirm_password: confirmPasswordSchema
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ['confirm_password']
  })

export const UserLoginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema
  })
  .strict()

export const UserLogoutSchema = z
  .object({
    refreshToken: refreshTokenSchema,
    authorization: accessTokenSchema
  })
  .strict()

export const UserVerifyEmailSchema = z
  .object({
    emailVerifyToken: z
      .string({
        required_error: USERS_MESSAGES.VERIFY_EMAIL_TOKEN_REQUIRED
      })
      .nonempty(USERS_MESSAGES.VERIFY_EMAIL_TOKEN_REQUIRED)
      .trim()
  })
  .strict()

export const UserForgotPasswordSchema = z
  .object({
    email: emailSchema
  })
  .strict()

export const UserVerifyForgotPasswordSchema = z
  .object({
    forgotPasswordToken: z
      .string({
        required_error: USERS_MESSAGES.VERIFY_PASSWORD_TOKEN_REQUIRED
      })
      .nonempty(USERS_MESSAGES.VERIFY_PASSWORD_TOKEN_REQUIRED)
      .trim() // Xóa khoảng trắng ở đầu và cuối
  })
  .strict()

export const UserResetPasswordSchema = z
  .object({
    forgotPasswordToken: z
      .string({
        required_error: USERS_MESSAGES.VERIFY_PASSWORD_TOKEN_REQUIRED
      })
      .nonempty(USERS_MESSAGES.VERIFY_PASSWORD_TOKEN_REQUIRED)
      .trim(), // Xóa khoảng trắng ở đầu và cuối
    password: passwordSchema, // Xóa khoảng trắng ở đầu và cuối
    confirm_password: confirmPasswordSchema
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ['confirm_password']
  })

export const UserUpdateSchema = z
  .object({
    name: z.string().min(3, USERS_MESSAGES.NAME_TOO_SHORT).max(50, USERS_MESSAGES.NAME_TOO_LONG).trim(), // Xóa khoảng trắng ở đầu và cuối
    dateOfBirth: dateOfBirthSchema,
    bio: z.string().min(1, USERS_MESSAGES.BIO_TOO_SHORT).max(255, USERS_MESSAGES.BIO_TOO_LONG).trim(),
    location: z.string().min(1, USERS_MESSAGES.LOCATION_TOO_SHORT).max(255, USERS_MESSAGES.LOCATION_TOO_LONG).trim(),
    website: z.string().min(1, USERS_MESSAGES.WEBSITE_TOO_SHORT).max(255, USERS_MESSAGES.WEBSITE_TOO_LONG).trim(),
    username: z
      .string()
      .min(3, USERS_MESSAGES.USER_NAME_TOO_SHORT)
      .max(30, USERS_MESSAGES.USER_NAME_TOO_LONG)
      .regex(REGEX_USERNAME, USERS_MESSAGES.USERNAME_INVALID),
    avatar: z.string().min(1, USERS_MESSAGES.AVATAR_TOO_SHORT).max(400, USERS_MESSAGES.AVATAR_TOO_LONG).trim(),
    coverPhoto: z
      .string()
      .min(1, USERS_MESSAGES.COVER_PHOTO_TOO_SHORT)
      .max(400, USERS_MESSAGES.COVER_PHOTO_TOO_LONG)
      .trim()
  })
  .partial() // optional

export const UserFollowSchema = z
  .object({
    followedUserId: userIdSchema
  })
  .strict()

export const UserUnfollowSchema = z
  .object({
    unfollowedUserId: userIdSchema
  })
  .strict()
