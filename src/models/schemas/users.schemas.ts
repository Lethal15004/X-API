import { z } from 'zod'

// Service
import * as usersServices from '~/services/users.services'

// Define schema
export const UserRegisterSchema = z
  .object({
    name: z
      .string({
        required_error: 'Name is required'
      })
      .min(1, 'Name is too short')
      .max(255, 'Name is too long')
      .nonempty('Name cannot be empty')
      .trim(), // Xóa khoảng trắng ở đầu và cuối
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email('Invalid email format')
      .nonempty('Email cannot be empty')
      .trim(), // Xóa khoảng trắng ở đầu và cuối
    password: z
      .string({
        required_error: 'Password is required'
      })
      .min(8, 'Password is too short')
      .max(255, 'Password is too long')
      .nonempty('Password cannot be empty')
      .trim(), // Xóa khoảng trắng ở đầu và cuối
    dateOfBirth: z
      .string({ required_error: 'Date of birth is required' })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format. Must be ISO-8601 (YYYY-MM-DD)'
      })
      .transform((val) => new Date(`${val}T00:00:00.000Z`)),
    confirm_password: z
      .string({
        required_error: 'Confirm password is required'
      })
      .min(8, 'Confirm password is too short')
      .max(255, 'Confirm password is too long')
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Confirm password is not match',
    path: ['confirm_password']
  })

export const UserLoginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required'
    })
    .email('Invalid email format')
    .nonempty('Email cannot be empty')
    .trim()
    .refine(async (email) => !usersServices.checkEmailExist(email), 'Email already exists'),
  password: z
    .string({
      required_error: 'Password is required'
    })
    .min(8, 'Length password is less 8')
    .max(255, 'Length password is more 255')
})

export const PersonSchema = z.object({
  person: z
    .string({
      required_error: 'person is required'
    })
    .nonempty('person cannot be empty')
})

// Define type
export type UserRegister = z.infer<typeof UserRegisterSchema>
export type UserLogin = z.infer<typeof UserLoginSchema>
export type Person = z.infer<typeof PersonSchema>
