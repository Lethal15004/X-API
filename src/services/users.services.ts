// BaseService
import { BaseService } from './base.services'
import { omit } from 'lodash'

// Schemas
import { UserRegisterSchema, UserLoginSchema } from '~/models/schemas/users.schemas'

// Utils
import * as bcryptPassword from '~/utils/bcrypt.utils'
import * as jwtToken from '~/utils/jwt.utils'
import throwErrors from '~/utils/throwErrors.utils'

// Constants
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
    user: UserModel
    accessToken: string
    refreshToken: string
  }> {
    const validateUser = await UserRegisterSchema.parseAsync(user)
    const isExist = await this.checkEmailExist(user.email)
    // Throw error if email already exists
    if (isExist) {
      throwErrors('EMAIL_EXISTS')
    }
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

  public async login(user: UserLoginBody): Promise<{
    user: UserModel
    accessToken: string
    refreshToken: string
  }> {
    const validateUser = await UserLoginSchema.parseAsync(user)
    const userExist = await this.checkEmailExist(user.email)
    // Throw error if email already exists
    if (!userExist) {
      throwErrors('EMAIL_NOT_EXISTS')
    }
    const checkPassword = await this.checkPassword(validateUser.password, userExist!)
    // Throw error if password is incorrect
    if (!checkPassword) {
      throwErrors('PASSWORD_INCORRECT')
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(userExist!.id),
      this.signRefreshToken(userExist!.id)
    ])
    return {
      user: userExist!,
      accessToken,
      refreshToken
    }
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

  public async checkEmailExist(email: string): Promise<UserModel | null> {
    const userExist = await this.prisma.users.findUnique({
      where: { email }
    })
    if (userExist) return userExist
    return null
  }

  public async checkPassword(password: string, userExist: UserModel): Promise<boolean> {
    return bcryptPassword.verifyPassword(password, userExist.password)
  }
}
