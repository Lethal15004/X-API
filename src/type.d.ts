import { z } from 'zod'
import jwt, { decode, SignOptions } from 'jsonwebtoken'

// Models
import { UserRegisterSchema, UserLoginSchema } from './models/schemas/users.schemas'

// Models prisma
import { Users, RefreshTokens } from '@prisma/client'

declare global {
  // Type Error
  type ErrorType = 'EMAIL_EXISTS' | 'EMAIL_NOT_EXISTS' | 'PASSWORD_INCORRECT' | 'UNAUTHORIZED' | 'INVALID_TOKEN'

  // Type Request
  type UserRegisterBody = z.infer<typeof UserRegisterSchema>
  type UserLoginBody = z.infer<typeof UserLoginSchema>

  // Type Model
  type UserModel = Users
  type RefreshTokenModel = RefreshTokens
}
declare module 'express' {
  interface Request {
    decoded_authorization?: jwt.JwtPayload
  }
}
export {}
