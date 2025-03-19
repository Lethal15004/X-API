import { z } from 'zod'
// Models
import { UserRegisterSchema, UserLoginSchema } from './models/schemas/users.schemas'

// Models prisma
import { Users } from '@prisma/client'

declare global {
  // Type Error
  type ErrorType = 'EMAIL_EXISTS' | 'EMAIL_NOT_EXISTS' | 'PASSWORD_INCORRECT'

  // Type Request
  type UserRegisterBody = z.infer<typeof UserRegisterSchema>
  type UserLoginBody = z.infer<typeof UserLoginSchema>

  // Type Model
  type UserModel = Users
}
export {}
