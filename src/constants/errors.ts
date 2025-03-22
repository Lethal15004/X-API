// Constants
import USERS_MESSAGES from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'

export const errorMap = {
  EMAIL_EXISTS: {
    message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS,
    status: HTTP_STATUS.UNAUTHORIZED
  },
  EMAIL_NOT_EXISTS: {
    message: USERS_MESSAGES.EMAIL_DOES_NOT_EXIST,
    status: HTTP_STATUS.UNAUTHORIZED
  },
  PASSWORD_INCORRECT: {
    message: USERS_MESSAGES.PASSWORD_INCORRECT,
    status: HTTP_STATUS.UNAUTHORIZED
  },
  UNAUTHORIZED: {
    message: USERS_MESSAGES.UNAUTHORIZED_ERROR,
    status: HTTP_STATUS.UNAUTHORIZED
  },
  INVALID_TOKEN: {
    message: USERS_MESSAGES.INVALID_TOKEN,
    status: HTTP_STATUS.UNAUTHORIZED
  }
} as const
