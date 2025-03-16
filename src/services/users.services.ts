// BaseService
import { BaseService } from './base.services'
import { omit } from 'lodash'

// Type in models
import { UserRegisterBody, UserLoginBody } from '~/models/requests/users.requests'

// Schemas Validator in models
import { UserRegisterSchema, UserLoginSchema } from '~/models/schemas/users.schemas'

// Type in models
import { Users } from '@prisma/client'

// Utils
import * as bcryptPassword from '~/utils/bcrypt.utils'
import * as jwtToken from '~/utils/jwt.utils'

// Enum
import { TokenType } from '~/constants/enums'

// Class Service
export class UsersService extends BaseService {
  private static instance: UsersService

  private readonly DEFAULT_USER_DATA = {
    bio: '',
    location: '',
    website: '',
    avatar: '',
    coverPhoto: '',
    emailVerifiedToken: '',
    forgotPasswordToken: '',
    verifyStatus: 0
  }

  private constructor() {
    super()
  }

  // Singleton
  public static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService()
    }
    return UsersService.instance
  }

  public async register(user: UserRegisterBody): Promise<{
    user: Users
    accessToken: string
    refreshToken: string
  }> {
    const validateUser = await UserRegisterSchema.parseAsync(user)
    const userData = {
      ...omit(validateUser, ['confirm_password']),
      ...this.DEFAULT_USER_DATA,
      password: bcryptPassword.hashPassword(validateUser.password)
    }
    const newUser = await this.prisma.users.create({
      data: userData
    })
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(newUser.id),
      this.signRefreshToken(newUser.id)
    ])
    return {
      user: newUser,
      accessToken,
      refreshToken
    }
  }

  public async login(user: UserLoginBody): Promise<Users | null> {
    const validateUser = await UserLoginSchema.parseAsync(user)
    const userExist = await this.prisma.users.findFirst({
      where: {
        email: validateUser.email
      }
    })
    if (!userExist) return null
    const checkPassword = bcryptPassword.verifyPassword(validateUser.password, userExist.password)
    if (!checkPassword) return null
    return userExist
  }

  private async signAccessToken(userId: string): Promise<string> {
    return jwtToken.signToken({
      payload: {
        userId,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: '15m'
      }
    })
  }

  private async signRefreshToken(userId: string): Promise<string> {
    return jwtToken.signToken({
      payload: {
        userId,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: '100d'
      }
    })
  }

  public async checkEmailExist(email: string): Promise<boolean> {
    try {
      const userExist = await this.prisma.users.findUnique({
        where: { email }
      })
      return !!userExist
    } catch (error) {
      return false
    }
  }
}
