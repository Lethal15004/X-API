import { injectable, inject } from 'inversify'
import { omit } from 'lodash'

// Schemas
import { UserRegisterSchema, UserLoginSchema } from '~/models/schemas/users.schemas'

// Utils
import * as bcryptPassword from '~/utils/bcrypt.utils'
import throwErrors from '~/utils/throwErrors.utils'
import { validateUser } from '~/utils/validate'

// Constants
import { TYPES_SERVICE } from '~/constants/types'
import { TokenType } from '~/constants/enums'

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
    // Validate user
    const validatedUser = await validateUser<UserRegisterBody>(UserRegisterSchema, user)
    // Check if email already exists
    const isExist = await this.checkEmailExist(user.email)
    // Throw error if email already exists
    if (isExist) {
      throwErrors('EMAIL_EXISTS')
    }
    const userData = {
      ...omit(validatedUser, ['confirm_password']),
      ...this.DEFAULT_USER_DATA,
      password: bcryptPassword.hashPassword(validatedUser.password)
    }
    const newUser = await this.PrismaService.create<UserModel>('users', userData)

    const { accessToken, refreshToken } = await this.createTokens(newUser.id)

    // Insert refresh token
    await this.saveRefreshToken(refreshToken, newUser.id)
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
    const validatedUser = await validateUser<UserLoginBody>(UserLoginSchema, user)
    const userExist = await this.checkEmailExist(user.email)
    // Throw error if email already exists
    if (!userExist) {
      throwErrors('EMAIL_NOT_EXISTS')
    }
    // Check password
    await this.checkPassword(validatedUser.password, userExist!)

    const { accessToken, refreshToken } = await this.createTokens(userExist!.id)
    // Insert refresh token
    await this.saveRefreshToken(refreshToken, userExist!.id)

    return {
      user: userExist!,
      accessToken,
      refreshToken
    }
  }

  public async logout(refreshToken: string): Promise<void> {
    await this.PrismaService.deleteMany('refresh_Tokens', { token: refreshToken })
  }

  // Functions help for service
  private async checkEmailExist(email: string): Promise<UserModel | null> {
    const isExist = await this.PrismaService.findUnique<UserModel>('users', { email })
    return isExist
  }

  private async checkPassword(password: string, userExist: UserModel): Promise<void> {
    const isMatch = bcryptPassword.verifyPassword(password, userExist.password)
    if (!isMatch) {
      throwErrors('PASSWORD_INCORRECT')
    }
  }

  private async createTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.AuthService.signAccessToken({
        userId,
        tokenType: TokenType.AccessToken
      }),
      this.AuthService.signRefreshToken({
        userId,
        tokenType: TokenType.RefreshToken
      })
    ])
    return { accessToken, refreshToken }
  }

  private async saveRefreshToken(refreshToken: string, userId: string): Promise<void> {
    await this.PrismaService.create<RefreshTokenModel>('refresh_Tokens', {
      expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRES),
      token: refreshToken,
      userId
    })
  }
}
