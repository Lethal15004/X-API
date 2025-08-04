"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEDIAS_MESSAGES = exports.USERS_MESSAGES = void 0;
exports.USERS_MESSAGES = {
    // Error
    UNAUTHORIZED_ERROR: 'Unauthorized',
    VALIDATION_ERROR: 'Validation error',
    // Users
    USER_NOT_FOUND: 'User not found',
    USER_NOT_VERIFIED: 'User not verified',
    GET_ME_SUCCESS: 'Get my profile success',
    GET_ME_FAILED: 'Get my profile failed',
    // Id
    INVALID_USER_ID: 'Invalid followed user id',
    // Date
    DATE_REQUIRED: 'Date is required',
    INVALID_DATE_FORMAT: 'Invalid date format. Must be (YYYY-MM-DD)',
    // Name
    NAME_TOO_SHORT: 'Name is too short',
    NAME_TOO_LONG: 'Name is too long',
    NAME_REQUIRED: 'Name is required',
    NAME_CANNOT_BE_EMPTY: 'Name cannot be empty',
    // Username
    USER_NAME_TOO_SHORT: 'User name is too short',
    USER_NAME_TOO_LONG: 'User name is too long',
    USERNAME_INVALID: 'Username can only contain letters, numbers, and underscores',
    // Password
    PASSWORD_TOO_SHORT: 'Password is too short',
    PASSWORD_TOO_LONG: 'Password is too long',
    PASSWORD_WEAK: 'Password is weak',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_CANNOT_BE_EMPTY: 'Password cannot be empty',
    PASSWORD_INCORRECT: 'Password is incorrect',
    PASSWORD_NOT_MATCH: 'Password is not correct',
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
    // Gmail
    GMAIL_NOT_VERIFIED: 'Gmail is not verified',
    // Bio
    BIO_TOO_SHORT: 'Bio is too short',
    BIO_TOO_LONG: 'Bio is too long',
    // Location
    LOCATION_TOO_SHORT: 'Location is too short',
    LOCATION_TOO_LONG: 'Location is too long',
    // Website
    WEBSITE_TOO_SHORT: 'Website is too short',
    WEBSITE_TOO_LONG: 'Website is too long',
    // Avatar
    AVATAR_TOO_SHORT: 'Avatar is too short',
    AVATAR_TOO_LONG: 'Avatar is too long',
    // Cover photo
    COVER_PHOTO_TOO_SHORT: 'Cover photo is too short',
    COVER_PHOTO_TOO_LONG: 'Cover photo is too long',
    // Follow
    FOLLOW_USER_ID_REQUIRED: 'User id is required too follow',
    CANNOT_FOLLOW_YOURSELF: 'Cannot follow yourself',
    CANNOT_UNFOLLOW_YOURSELF: 'Cannot unfollow yourself',
    FOLLOWED_USER_NOT_FOUND: 'Followed user not found',
    ALREADY_FOLLOWED_BEFORE: 'Already followed this user before',
    ALREADY_UNFOLLOWED_BEFORE: 'Already unfollowed this user before',
    // JSON
    LOGIN_SUCCESS: 'User login success',
    REGISTER_SUCCESS: 'User register success',
    LOGOUT_SUCCESS: 'User logout success',
    LOGIN_FAILED: 'User login failed',
    REGISTER_FAILED: 'User register failed',
    LOGOUT_FAILED: 'User logout failed',
    UPDATE_SUCCESS: 'User update success',
    UPDATE_FAILED: 'User update failed',
    GET_PROFILE_SUCCESS: 'Get profile success',
    GET_PROFILE_FAILED: 'Get profile failed',
    FOLLOW_SUCCESS: 'Follow success',
    FOLLOW_FAILED: 'Follow failed',
    ALREADY_FOLLOW: 'Already follow this user',
    UNFOLLOW_SUCCESS: 'Unfollow success',
    UNFOLLOW_FAILED: 'Unfollow failed',
    CHANGE_PASSWORD_SUCCESS: 'Change password success',
    CHANGE_PASSWORD_FAILED: 'Change password failed',
    CANNOT_ACCESS_GOOGLE: 'Cannot access to google',
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
    EMAIL_TO_RESET_PASSWORD_FAILED: 'Send email to reset password failed',
    VERIFY_PASSWORD_TOKEN_REQUIRED: 'Verify password token is required',
    INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
    VERIFIED_FORGOT_PASSWORD_SUCCESS: 'Verified forgot password success',
    VERIFIED_FORGOT_PASSWORD_FAILED: 'Verified forgot password failed',
    // Reset password
    RESET_PASSWORD_SUCCESS: 'Reset password success',
    RESET_PASSWORD_FAILED: 'Reset password failed'
};
exports.MEDIAS_MESSAGES = {
    // JSON
    UPLOAD_IMAGE_SUCCESS: 'Upload image successfully',
    UPLOAD_IMAGE_FAILED: 'Upload image failed',
    UPLOAD_VIDEO_SUCCESS: 'Upload video successfully',
    UPLOAD_VIDEO_FAILED: 'Upload video failed',
    // File
    FILE_NOT_FOUND: 'File cannot find'
};
