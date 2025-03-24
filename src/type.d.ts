import { z } from 'zod'
import jwt, { decode, SignOptions } from 'jsonwebtoken'

// Constants
import { TokenType } from './constants/enums'

// Models
import { UserRegisterSchema, UserLoginSchema } from './models/schemas/users.schemas'

// Models prisma
import { Users, RefreshTokens } from '@prisma/client'

declare global {
  // Type Error
  type ErrorType =
    | 'EMAIL_EXISTS'
    | 'EMAIL_NOT_EXISTS'
    | 'PASSWORD_INCORRECT'
    | 'UNAUTHORIZED'
    | 'ACCESS_TOKEN_REQUIRED'
    | 'INVALID_ACCESS_TOKEN'
    | 'REFRESH_TOKEN_REQUIRED'
    | 'INVALID_REFRESH_TOKEN'
    | 'USED_REFRESH_TOKEN_OR_NOT_EXISTS'

  // Type Request
  type UserRegisterBody = z.infer<typeof UserRegisterSchema>
  type UserLoginBody = z.infer<typeof UserLoginSchema>
  type TokenPayload = jwt.JwtPayload & {
    userId: string
    tokenType: TokenType
  }
  type UserLogoutBody = {
    refreshToken: string
  }

  // Type Model
  type UserModel = Users
  type RefreshTokenModel = RefreshTokens
}
declare module 'express' {
  interface Request {
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
export {}
