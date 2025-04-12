import { z } from 'zod'

// Constants
import USERS_MESSAGES from '~/constants/messages'
import { passwordSchema, emailSchema, confirmPasswordSchema } from '~/constants/schemas'

// Define schema
export const UserRegisterSchema = z
  .object({
    name: z
      .string({
        required_error: USERS_MESSAGES.NAME_REQUIRED
      })
      .min(5, USERS_MESSAGES.NAME_TOO_SHORT)
      .max(255, USERS_MESSAGES.NAME_TOO_LONG)
      .nonempty(USERS_MESSAGES.NAME_CANNOT_BE_EMPTY)
      .trim(), // Xóa khoảng trắng ở đầu và cuối
    email: emailSchema,
    password: passwordSchema,
    dateOfBirth: z
      .string({ required_error: USERS_MESSAGES.DATE_REQUIRED })
      .refine((dateOfBirth) => !isNaN(Date.parse(dateOfBirth)), {
        message: USERS_MESSAGES.INVALID_DATE_FORMAT
      })
      .transform((val) => new Date(`${val}T00:00:00.000Z`)),
    confirm_password: confirmPasswordSchema
  })
  .refine((data) => data.password === data.confirm_password, {
    message: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ['confirm_password']
  })

export const UserLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

export const UserLogoutSchema = z.object({
  refreshToken: z
    .string({
      required_error: USERS_MESSAGES.REFRESH_TOKEN_REQUIRED
    })
    .nonempty(USERS_MESSAGES.REFRESH_TOKEN_REQUIRED),
  authorization: z
    .string({
      required_error: USERS_MESSAGES.ACCESS_TOKEN_REQUIRED
    })
    .nonempty(USERS_MESSAGES.ACCESS_TOKEN_REQUIRED)
    .regex(/^Bearer\s+/, {
      message: USERS_MESSAGES.INVALID_ACCESS_TOKEN
    })
    .transform((bearer) => bearer.split(' ')[1])
})

export const UserVerifyEmailSchema = z.object({
  emailVerifyToken: z
    .string({
      required_error: USERS_MESSAGES.VERIFY_EMAIL_TOKEN_REQUIRED
    })
    .nonempty(USERS_MESSAGES.VERIFY_EMAIL_TOKEN_REQUIRED)
    .trim()
})

export const UserForgotPasswordSchema = z.object({
  email: emailSchema
})

export const UserVerifyForgotPasswordSchema = z.object({
  forgotPasswordToken: z
    .string({
      required_error: USERS_MESSAGES.VERIFY_PASSWORD_TOKEN_REQUIRED
    })
    .nonempty(USERS_MESSAGES.VERIFY_PASSWORD_TOKEN_REQUIRED)
    .trim() // Xóa khoảng trắng ở đầu và cuối
})

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
  .refine((data) => data.password === data.confirm_password, {
    message: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ['confirm_password']
  })
