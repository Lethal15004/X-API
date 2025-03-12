import { date, z } from 'zod'

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
      .trim() // Xóa khoảng trắng ở đầu và cuối
      .refine(async (email) => !(await usersServices.checkEmailExist(email)), 'Email already exists'),
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
      .refine((dateOfBirth) => !isNaN(Date.parse(dateOfBirth)), {
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
    .refine(async (email) => await usersServices.checkEmailExist(email), 'Email does not exist'),
  password: z
    .string({
      required_error: 'Password is required'
    })
    .min(8, 'Length password is less 8')
    .max(255, 'Length password is more 255')
})
