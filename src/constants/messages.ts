const USERS_MESSAGES = {
  // Error
  UNAUTHORIZED_ERROR: 'Unauthorized',
  VALIDATION_ERROR: 'Validation error',

  // Users
  USER_NOT_FOUND: 'User not found',

  // Date
  DATE_REQUIRED: 'Date is required',
  INVALID_DATE_FORMAT: 'Invalid date format. Must be (YYYY-MM-DD)',

  // Name
  NAME_TOO_SHORT: 'Name is too short',
  NAME_TOO_LONG: 'Name is too long',
  NAME_REQUIRED: 'Name is required',
  NAME_CANNOT_BE_EMPTY: 'Name cannot be empty',

  // Password
  PASSWORD_TOO_SHORT: 'Password is too short',
  PASSWORD_TOO_LONG: 'Password is too long',
  PASSWORD_WEAK: 'Password is weak',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_CANNOT_BE_EMPTY: 'Password cannot be empty',
  PASSWORD_INCORRECT: 'Password is incorrect',

  // Confirm password
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_CANNOT_BE_EMPTY: 'Confirm password cannot be empty',
  CONFIRM_PASSWORD_NOT_MATCH: 'Confirm password not match',
  CONFIRM_PASSWORD_TOO_SHORT: 'Confirm password is too short',
  CONFIRM_PASSWORD_TOO_LONG: 'Confirm password is too long',

  // Email
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_DOES_NOT_EXIST: 'Email does not exist',
  EMAIL_REQUIRED: 'Email is required',
  INVALID_EMAIL_FORMAT: 'Invalid email format',
  EMAIL_CANNOT_BE_EMPTY: 'Email cannot be empty',

  // JSON
  LOGIN_SUCCESS: 'User login success',
  REGISTER_SUCCESS: 'User register success',
  LOGOUT_SUCCESS: 'User logout success',
  LOGIN_FAILED: 'User login failed',
  REGISTER_FAILED: 'User register failed',
  LOGOUT_FAILED: 'User logout failed',

  // Access token
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  INVALID_ACCESS_TOKEN: 'Invalid access token',

  // Refresh token
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  USED_REFRESH_TOKEN_OR_NOT_EXISTS: 'Used refresh token or not exists',

  // Verify email token
  VERIFY_EMAIL_TOKEN_REQUIRED: 'Verify email token is required',
  INVALID_VERIFY_EMAIL_TOKEN: 'Invalid verify email token',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  VERIFIED_EMAIL_SUCCESS: 'Verified email success',
  VERIFIED_EMAIL_FAILED: 'Verified email failed',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  RESEND_VERIFY_EMAIL_FAILED: 'Resend verify email failed',

  // Forgot password token
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  EMAIL_TO_RESET_PASSWORD_FAILED: 'Send email to reset password failed'
} as const

export default USERS_MESSAGES
