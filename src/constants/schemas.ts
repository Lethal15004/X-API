import { z } from 'zod'

// Constants
import { USERS_MESSAGES, MEDIAS_MESSAGES } from '~/constants/messages'

// Define schema for help

// 1. Users
export const passwordSchema = z
  .string({
    required_error: USERS_MESSAGES.PASSWORD_REQUIRED
  })
  .min(8, USERS_MESSAGES.PASSWORD_TOO_SHORT)
  .max(255, USERS_MESSAGES.PASSWORD_TOO_LONG)
  .nonempty(USERS_MESSAGES.PASSWORD_CANNOT_BE_EMPTY)
  .trim()

export const emailSchema = z
  .string({
    required_error: USERS_MESSAGES.EMAIL_REQUIRED
  })
  .email(USERS_MESSAGES.INVALID_EMAIL_FORMAT)
  .nonempty(USERS_MESSAGES.EMAIL_CANNOT_BE_EMPTY)
  .trim()

export const confirmPasswordSchema = z
  .string({
    required_error: USERS_MESSAGES.CONFIRM_PASSWORD_REQUIRED
  })
  .min(8, USERS_MESSAGES.CONFIRM_PASSWORD_TOO_SHORT)
  .max(255, USERS_MESSAGES.CONFIRM_PASSWORD_TOO_LONG)
  .nonempty(USERS_MESSAGES.CONFIRM_PASSWORD_CANNOT_BE_EMPTY)

export const verifyStatusOptional = z.number().default(0).optional()

export const nameSchema = z
  .string({
    required_error: USERS_MESSAGES.NAME_REQUIRED
  })
  .min(3, USERS_MESSAGES.NAME_TOO_SHORT)
  .max(50, USERS_MESSAGES.NAME_TOO_LONG)
  .nonempty(USERS_MESSAGES.NAME_CANNOT_BE_EMPTY)
  .trim() // Xóa khoảng trắng ở đầu và cuối

export const dateOfBirthSchema = z
  .string({ required_error: USERS_MESSAGES.DATE_REQUIRED })
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: USERS_MESSAGES.INVALID_DATE_FORMAT
  })
  .transform((val) => new Date(`${val}T00:00:00.000Z`))

export const refreshTokenSchema = z
  .string({
    required_error: USERS_MESSAGES.REFRESH_TOKEN_REQUIRED
  })
  .nonempty(USERS_MESSAGES.REFRESH_TOKEN_REQUIRED)

export const accessTokenSchema = z
  .string({
    required_error: USERS_MESSAGES.ACCESS_TOKEN_REQUIRED
  })
  .nonempty(USERS_MESSAGES.ACCESS_TOKEN_REQUIRED)
  .regex(/^Bearer\s+/, {
    message: USERS_MESSAGES.INVALID_ACCESS_TOKEN
  })
  .transform((bearer) => bearer.split(' ')[1])

export const userIdSchema = z
  .string({
    required_error: USERS_MESSAGES.FOLLOW_USER_ID_REQUIRED
  })
  .nonempty(USERS_MESSAGES.FOLLOW_USER_ID_REQUIRED)
  .trim() // Xóa khoảng trắng ở đầu và cuối

// 2. Static
export const nameImage = z
  .string({
    required_error: MEDIAS_MESSAGES.FILE_NOT_FOUND
  })
  .nonempty(MEDIAS_MESSAGES.FILE_NOT_FOUND)
  .trim()

export const nameVideo = z
  .string({
    required_error: MEDIAS_MESSAGES.FILE_NOT_FOUND
  })
  .nonempty(MEDIAS_MESSAGES.FILE_NOT_FOUND)
  .trim()
