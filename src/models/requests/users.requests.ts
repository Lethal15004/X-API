import { z } from 'zod'
// Schemas Validator in models
import { UserRegisterSchema, UserLoginSchema } from '~/models/schemas/users.schemas'

// Define type request
export type UserLoginBody = z.infer<typeof UserLoginSchema>
export type UserRegisterBody = z.infer<typeof UserRegisterSchema>
