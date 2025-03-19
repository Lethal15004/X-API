import { z } from 'zod'

// Constants
import USERS_MESSAGES from '~/constants/messages'

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
    email: z
      .string({
        required_error: USERS_MESSAGES.EMAIL_REQUIRED
      })
      .email(USERS_MESSAGES.INVALID_EMAIL_FORMAT)
      .nonempty(USERS_MESSAGES.EMAIL_CANNOT_BE_EMPTY)
      .trim(), // Xóa khoảng trắng ở đầu và cuối
    password: z
      .string({
        required_error: USERS_MESSAGES.PASSWORD_REQUIRED
      })
      .min(8, USERS_MESSAGES.PASSWORD_TOO_SHORT)
      .max(255, USERS_MESSAGES.PASSWORD_TOO_LONG)
      .nonempty(USERS_MESSAGES.PASSWORD_CANNOT_BE_EMPTY)
      .trim(), // Xóa khoảng trắng ở đầu và cuối
    dateOfBirth: z
      .string({ required_error: USERS_MESSAGES.DATE_REQUIRED })
      .refine((dateOfBirth) => !isNaN(Date.parse(dateOfBirth)), {
        message: USERS_MESSAGES.INVALID_DATE_FORMAT
      })
      .transform((val) => new Date(`${val}T00:00:00.000Z`)),
    confirm_password: z
      .string({
        required_error: USERS_MESSAGES.CONFIRM_PASSWORD_REQUIRED
      })
      .min(8, USERS_MESSAGES.CONFIRM_PASSWORD_TOO_SHORT)
      .max(255, USERS_MESSAGES.CONFIRM_PASSWORD_TOO_LONG)
      .nonempty(USERS_MESSAGES.CONFIRM_PASSWORD_CANNOT_BE_EMPTY)
  })
  .refine((data) => data.password === data.confirm_password, {
    message: USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ['confirm_password']
  })

export const UserLoginSchema = z.object({
  email: z
    .string({
      required_error: USERS_MESSAGES.EMAIL_REQUIRED
    })
    .email(USERS_MESSAGES.INVALID_EMAIL_FORMAT)
    .nonempty(USERS_MESSAGES.EMAIL_CANNOT_BE_EMPTY)
    .trim(),
  password: z
    .string({
      required_error: USERS_MESSAGES.PASSWORD_REQUIRED
    })
    .min(8, USERS_MESSAGES.PASSWORD_TOO_SHORT)
    .max(255, USERS_MESSAGES.PASSWORD_TOO_LONG)
})
