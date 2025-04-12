import { z } from 'zod'

// Constants
import USERS_MESSAGES from '~/constants/messages'

// Define schema for help
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
