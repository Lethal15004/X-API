import { z } from 'zod'
import jwt, { decode, SignOptions } from 'jsonwebtoken'

// Constants
import { TokenType } from './constants/enums'

// Models
import {
  UserRegisterSchema,
  UserLoginSchema,
  UserLogoutSchema,
  UserVerifyEmailSchema,
  UserForgotPasswordSchema
} from './models/schemas/users.schemas'

// Models prisma
import { Users, RefreshTokens } from '@prisma/client'

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

  // Type Request
  type UserRegisterBody = z.infer<typeof UserRegisterSchema>
  type UserLoginBody = z.infer<typeof UserLoginSchema>
  type UserLogoutBody = {
    refreshToken: string
  }
  type UserVerifyEmailBody = z.infer<typeof UserVerifyEmailSchema>
  type UserForgotPasswordBody = z.infer<typeof UserForgotPasswordSchema>

  type TokenPayload = jwt.JwtPayload & {
    userId: string
    tokenType: TokenType
  }

  // Type Model
  type UserModel = Users
  type RefreshTokenModel = RefreshTokens
}
declare module 'express' {
  interface Request {
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
  }
}
export {}
