const USERS_MESSAGES = {
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
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',
  LOGOUT_SUCCESS: 'Logout success',

  // Access token
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  INVALID_ACCESS_TOKEN: 'Invalid access token',

  // Refresh token
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  USED_REFRESH_TOKEN_OR_NOT_EXISTS: 'Used refresh token or not exists'
} as const

export default USERS_MESSAGES
