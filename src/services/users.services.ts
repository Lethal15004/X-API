import { PrismaClient } from '@prisma/client'
import { omit } from 'lodash'

const prisma = new PrismaClient()

// Type in models
import { UserRegister, UserLogin } from '~/models/schemas/users.schemas'

// Schemas Validator in models
import { UserRegisterSchema, UserLoginSchema, PersonSchema } from '~/models/schemas/users.schemas'

export const register = async (user: UserRegister): Promise<boolean> => {
  try {
    const validatedUser = await UserRegisterSchema.parseAsync(user)
    const userData = omit(validatedUser, ['confirm_password'])
    await prisma.users.create({
      data: {
        ...userData,
        bio: '',
        location: '',
        website: '',
        avatar: '',
        coverPhoto: '',
        emailVerifiedToken: '',
        forgotPasswordToken: '',
        verifyStatus: 0
      }
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const login = async (user: UserLogin): Promise<boolean> => {
  try {
    const userExist = await prisma.users.findFirst({
      where: {
        email: user.email,
        password: user.password
      }
    })
    if (userExist) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

export const checkEmailExist = async (email: string): Promise<boolean> => {
  try {
    const userExist = await prisma.users.findUnique({
      where: { email }
    })
    if (userExist) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}
