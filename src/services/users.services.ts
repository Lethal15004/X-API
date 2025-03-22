import { injectable, inject } from 'inversify'
import { omit } from 'lodash'

// Schemas
import { UserRegisterSchema, UserLoginSchema } from '~/models/schemas/users.schemas'

// Utils
import * as bcryptPassword from '~/utils/bcrypt.utils'
import throwErrors from '~/utils/throwErrors.utils'

// Constants
import { TYPES_SERVICE } from '~/constants/types'

// Interfaces
import { IUserService } from '~/interfaces/IUserService'
import { IAuthService } from '~/interfaces/IAuthService'
import { IPrismaService } from '~/interfaces/IPrismaService'

// Class Service
@injectable()
export class UserService implements IUserService {
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
  private readonly REFRESH_TOKEN_EXPIRES = 100 * 24 * 60 * 60 * 1000

  constructor(
    @inject(TYPES_SERVICE.PrismaService) private readonly PrismaService: IPrismaService,
    @inject(TYPES_SERVICE.AuthService) private readonly AuthService: IAuthService
  ) {}

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
    const newUser = await this.PrismaService.create<UserModel>('users', userData)
    const [accessToken, refreshToken] = await Promise.all([
      this.AuthService.signAccessToken(newUser.id),
      this.AuthService.signRefreshToken(newUser.id)
    ])

    const refreshTokenData = {
      expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRES),
      token: refreshToken,
      user_id: newUser.id
    }
    // Insert refresh token
    await this.PrismaService.create<RefreshTokenModel>('refresh_Tokens', refreshTokenData)
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
      this.AuthService.signAccessToken(userExist!.id),
      this.AuthService.signRefreshToken(userExist!.id)
    ])

    // Insert refresh token
    const refreshTokenData = {
      expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRES),
      token: refreshToken,
      user_id: userExist!.id
    }
    await this.PrismaService.create<RefreshTokenModel>('refresh_Tokens', refreshTokenData)
    return {
      user: userExist!,
      accessToken,
      refreshToken
    }
  }

  public async checkEmailExist(email: string): Promise<UserModel | null> {
    return this.PrismaService.findOne<UserModel>('users', { email })
  }

  public async checkPassword(password: string, userExist: UserModel): Promise<boolean> {
    return bcryptPassword.verifyPassword(password, userExist.password)
  }
}
