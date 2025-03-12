import { PrismaClient, Users } from '@prisma/client'
import { omit } from 'lodash'

const prisma = new PrismaClient()

// Type in models
import { UserRegisterBody, UserLoginBody } from '~/models/requests/users.requests'

// Schemas Validator in models
import { UserRegisterSchema, UserLoginSchema } from '~/models/schemas/users.schemas'

// Utils
import * as bcryptPassword from '~/utils/bcrypt.utils'
import * as jwtToken from '~/utils/jwt.utils'

// Enum
import { TokenType } from '~/constants/enums'

export const register = async (user: UserRegisterBody): Promise<Users | null> => {
  try {
    user = await UserRegisterSchema.parseAsync(user)
    const userData = omit(user, ['confirm_password'])
    userData.password = bcryptPassword.hashPassword(userData.password)
    const newUser = await prisma.users.create({
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
    const [accessToken, refreshToken] = await Promise.all([signAccessToken(newUser.id), signRefreshToken(newUser.id)])
    return newUser
  } catch (error) {
    console.error(error)
    return null
  }
}

export const login = async (user: UserLoginBody): Promise<boolean> => {
  try {
    user = await UserLoginSchema.parseAsync(user)
    const userExist = await prisma.users.findFirst({
      where: {
        email: user.email
      }
    })
    if (userExist) {
      const checkPassword = bcryptPassword.verifyPassword(user.password, userExist.password)
      if (checkPassword) {
        return true
      } else {
        return false
      }
    } else return false
  } catch (error) {
    console.error(error)
    return false
  }
}

export const signAccessToken = async (user_id: string): Promise<string> => {
  return jwtToken.signToken({
    payload: {
      user_id,
      token_type: TokenType.AccessToken
    },
    options: {
      expiresIn: '15m'
    }
  })
}
export const signRefreshToken = async (user_id: string): Promise<string> => {
  return jwtToken.signToken({
    payload: {
      user_id,
      token_type: TokenType.RefreshToken
    },
    options: {
      expiresIn: '100d'
    }
  })
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
