import { z } from 'zod'
import jwt, { decode, SignOptions } from 'jsonwebtoken'

// Constants
import { TokenType, UserVerifyStatus } from './constants/enums'

// Models
import {
  UserRegisterSchema,
  UserLoginSchema,
  UserLogoutSchema,
  UserVerifyEmailSchema,
  UserForgotPasswordSchema,
  UserVerifyForgotPasswordSchema,
  UserResetPasswordSchema,
  UserUpdateSchema,
  UserFollowSchema,
  UserUnfollowSchema
} from './models/schemas/users.schemas'

// Models prisma
import { Users, RefreshTokens, Followers } from '@prisma/client'

declare global {
  // Type Error
  type ErrorType =
    | 'USER_NOT_FOUND'
    | 'EMAIL_EXISTS'
    | 'EMAIL_NOT_EXISTS'
    | 'PASSWORD_INCORRECT'
    | 'UNAUTHORIZED'
    | 'ACCESS_TOKEN_REQUIRED'
    | 'INVALID_ACCESS_TOKEN'
    | 'REFRESH_TOKEN_REQUIRED'
    | 'INVALID_REFRESH_TOKEN'
    | 'USED_REFRESH_TOKEN_OR_NOT_EXISTS'
    | 'EMAIL_ALREADY_VERIFIED_BEFORE'
    | 'INVALID_FORGOT_PASSWORD_TOKEN'
    | 'USER_NOT_VERIFIED'
    | 'INVALID_USER_ID'
    | 'CANNOT_FOLLOW_YOURSELF'
    | 'FOLLOWED_USER_NOT_FOUND'
    | 'ALREADY_FOLLOWED_BEFORE'
    | 'CANNOT_UNFOLLOW_YOURSELF'
    | 'ALREADY_UNFOLLOWED_BEFORE'

  // Type Request
  type UserRegisterBody = z.infer<typeof UserRegisterSchema>
  type UserLoginBody = z.infer<typeof UserLoginSchema>
  type UserLogoutBody = {
    refreshToken: string
  }
  type UserVerifyEmailBody = z.infer<typeof UserVerifyEmailSchema>
  type UserForgotPasswordBody = z.infer<typeof UserForgotPasswordSchema>
  type UserVerifyForgotPasswordBody = z.infer<typeof UserVerifyForgotPasswordSchema>
  type UserResetPasswordBody = z.infer<typeof UserResetPasswordSchema>
  type UserUpdateBody = z.infer<typeof UserUpdateSchema>
  type UserGetProfileParams = {
    username: string
  }
  type UserFollowParams = z.infer<typeof UserFollowSchema>
  type UserUnfollowParams = z.infer<typeof UserUnfollowSchema>
  type TokenPayload = jwt.JwtPayload & {
    userId: string
    tokenType: TokenType
    verifyStatus: UserVerifyStatus
  }

  // Type Model
  type UserModel = Users
  type RefreshTokenModel = RefreshTokens
  type FollowersModel = Followers
}
declare module 'express' {
  interface Request {
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_verify_token?: TokenPayload
  }
}
export {}
