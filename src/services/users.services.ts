import { injectable, inject } from 'inversify'
import { omit } from 'lodash'

// Utils
import * as bcryptPassword from '~/utils/bcrypt.utils'
import throwErrors from '~/utils/throw-errors.utils'
import excludeFields from '~/utils/sanitize.utils'

// Constants
import { TYPES_SERVICE } from '~/constants/types'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { DbTables } from '~/constants/db-tables.enum'

// Interfaces
import { IUserService } from '~/interfaces/IUserService'
import { IAuthService } from '~/interfaces/IAuthService'
import { IPrismaService } from '~/interfaces/IPrismaService'
import { ObjectId } from 'mongodb'

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

  public async getMe(userId: string): Promise<UserModel> {
    const user = await this.checkUserExist(userId as string)
    const newUser = excludeFields(user as UserModel, ['password', 'emailVerifiedToken', 'forgotPasswordToken'])
    return newUser as UserModel
  }

  public async getProfile(username: string): Promise<UserModel> {
    const user = await this.PrismaService.findUnique<UserModel>(DbTables.USERS, { username: username })
    if (!user) {
      throwErrors('USER_NOT_FOUND')
    }
    const newUser = excludeFields(user as UserModel, [
      'password',
      'emailVerifiedToken',
      'forgotPasswordToken',
      'verifyStatus',
      'createdAt',
      'updatedAt'
    ])
    return newUser as UserModel
  }

  public async updateMe(userId: string, payload: UserUpdateBody): Promise<UserModel> {
    const [userUpdated] = await Promise.all([
      this.PrismaService.update<UserModel>(DbTables.USERS, { id: userId }, payload)
    ])
    const newUser = excludeFields(userUpdated as UserModel, ['password', 'emailVerifiedToken', 'forgotPasswordToken'])
    return newUser as UserModel
  }

  public async register(user: UserRegisterBody): Promise<{
    user: UserModel
    accessToken: string
    refreshToken: string
  }> {
    // Check if email already exists
    const isExist = await this.checkEmailExist(user.email)
    // Throw error if email already exists
    if (isExist) {
      throwErrors('EMAIL_EXISTS')
    }
    const userId = new ObjectId()
    const emailVerifiedToken = await this.createVerifyEmailToken(userId.toString(), UserVerifyStatus.Unverified)

    const userData = {
      ...omit(user, ['confirm_password']),
      ...this.DEFAULT_USER_DATA,
      id: userId,
      emailVerifiedToken: emailVerifiedToken,
      password: bcryptPassword.hashPassword(user.password)
    }
    const newUser = await this.PrismaService.create<UserModel>(DbTables.USERS, userData)

    const { accessToken, refreshToken } = await this.createTokens(newUser.id, UserVerifyStatus.Unverified)

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
    const userExist = await this.checkEmailExist(user.email)
    // Throw error if email already exists
    if (!userExist) {
      throwErrors('EMAIL_NOT_EXISTS')
    }

    // Check password
    this.checkPassword(user.password, userExist!)

    const { accessToken, refreshToken } = await this.createTokens(
      userExist!.id,
      userExist?.verifyStatus as UserVerifyStatus
    )
    // Insert refresh token
    await this.saveRefreshToken(refreshToken, userExist!.id)

    return {
      user: userExist!,
      accessToken,
      refreshToken
    }
  }

  public async logout(refreshToken: string): Promise<boolean> {
    const isExist = await this.isExistRefreshToken(refreshToken)
    if (!isExist) {
      throwErrors('USED_REFRESH_TOKEN_OR_NOT_EXISTS')
    }
    await this.PrismaService.deleteMany(DbTables.REFRESH_TOKENS, { token: refreshToken })
    return true
  }

  public async emailVerify(decoded_email_verify_token: TokenPayload): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    const { userId } = decoded_email_verify_token

    const user = await this.checkUserExist(userId)
    // If email verified
    if (user?.emailVerifiedToken === '') {
      throwErrors('EMAIL_ALREADY_VERIFIED_BEFORE')
    }

    const [token] = await Promise.all([
      this.createTokens(userId, UserVerifyStatus.Verified),
      await this.PrismaService.update<UserModel>(
        DbTables.USERS,
        { id: userId },
        { emailVerifiedToken: '', verifyStatus: UserVerifyStatus.Verified }
      )
    ])
    const { accessToken, refreshToken } = token
    return {
      accessToken,
      refreshToken
    }
  }

  public async resendEmailVerify(decoded_authorization: TokenPayload): Promise<boolean> {
    const { userId } = decoded_authorization
    const user = await this.checkUserExist(userId)

    // If email verified
    if (user?.verifyStatus === UserVerifyStatus.Verified) {
      throwErrors('EMAIL_ALREADY_VERIFIED_BEFORE')
    }
    const emailVerifiedToken = await this.createVerifyEmailToken(userId as string, UserVerifyStatus.Unverified)

    // Fake send email
    console.log('Resend verify email: ', emailVerifiedToken)

    // Update
    await this.PrismaService.update<UserModel>(
      DbTables.USERS,
      { id: userId },
      { emailVerifiedToken: emailVerifiedToken }
    )
    return true
  }

  public async forgotPassword(email: string): Promise<boolean> {
    const userExist = await this.checkEmailExist(email)

    const forgotPasswordToken = await this.createForgotPasswordToken(
      userExist?.id as string,
      userExist?.verifyStatus as UserVerifyStatus
    )
    await this.PrismaService.update<UserModel>(
      DbTables.USERS,
      { id: userExist?.id },
      { forgotPasswordToken: forgotPasswordToken }
    )
    // Send Email with email User: https://twitter.com/forgot-password?token=token
    console.log('forgot password token: ', forgotPasswordToken)
    return true
  }

  public async forgotPasswordVerify(
    decoded_forgot_password_verify_token: TokenPayload,
    forgotPasswordToken: string
  ): Promise<boolean> {
    const { userId } = decoded_forgot_password_verify_token
    const user = await this.checkUserExist(userId)

    if (user?.forgotPasswordToken !== forgotPasswordToken) {
      throwErrors('INVALID_FORGOT_PASSWORD_TOKEN')
    }
    return true
  }

  public async resetPassword(
    decoded_forgot_password_verify_token: TokenPayload,
    forgotPasswordToken: string,
    password: string
  ): Promise<boolean> {
    const { userId } = decoded_forgot_password_verify_token
    const user = await this.checkUserExist(userId)

    if (user?.forgotPasswordToken !== forgotPasswordToken) {
      throwErrors('INVALID_FORGOT_PASSWORD_TOKEN')
    }
    await this.PrismaService.update<UserModel>(
      DbTables.USERS,
      { id: user?.id },
      { forgotPasswordToken: '', password: bcryptPassword.hashPassword(password) }
    )
    return true
  }

  public async follow(followedUserId: string, decoded_authorization: TokenPayload): Promise<boolean> {
    const currentUserId = decoded_authorization.userId
    const { followRelation } = await this.validateFollowOperation(followedUserId, currentUserId, 'follow')
    if (followRelation) {
      throwErrors('ALREADY_FOLLOWED_BEFORE')
    }
    await this.PrismaService.create<FollowersModel>(DbTables.FOLLOWERS, {
      userId: currentUserId,
      followedUserId: followedUserId
    })

    return true
  }

  public async unfollow(unfollowedUserId: string, decoded_authorization: TokenPayload): Promise<boolean> {
    const currentUserId = decoded_authorization.userId
    const { followRelation } = await this.validateFollowOperation(unfollowedUserId, currentUserId, 'unfollow')

    if (!followRelation) {
      throwErrors('ALREADY_UNFOLLOWED_BEFORE')
    }
    await this.PrismaService.deleteFirst(DbTables.FOLLOWERS, {
      id: followRelation?.id
    })
    return true
  }

  // Functions help for service
  private async checkEmailExist(email: string): Promise<UserModel | null> {
    const isExist = await this.PrismaService.findUnique<UserModel>(DbTables.USERS, { email })
    return isExist
  }

  private checkPassword(password: string, userExist: UserModel): void {
    const isMatch = bcryptPassword.verifyPassword(password, userExist.password)
    if (!isMatch) {
      throwErrors('PASSWORD_INCORRECT')
    }
  }

  private async checkUserExist(userId: string): Promise<UserModel | null> {
    const user = await this.PrismaService.findUnique<UserModel>(DbTables.USERS, { id: userId })
    if (!user) {
      throwErrors('USER_NOT_FOUND')
    }
    return user
  }

  private async createTokens(
    userId: string,
    verifyStatus: UserVerifyStatus
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.AuthService.signAccessToken({
        userId,
        tokenType: TokenType.AccessToken,
        verifyStatus: verifyStatus
      }),
      this.AuthService.signRefreshToken({
        userId,
        tokenType: TokenType.RefreshToken,
        verifyStatus: verifyStatus
      })
    ])
    return { accessToken, refreshToken }
  }

  private async createVerifyEmailToken(userId: string, verifyStatus: UserVerifyStatus): Promise<string> {
    const emailVerifiedToken = await this.AuthService.signEmailVerifyToken({
      userId: userId.toString(),
      tokenType: TokenType.EmailVerifyToken,
      verifyStatus: verifyStatus
    })
    return emailVerifiedToken
  }

  private async createForgotPasswordToken(userId: string, verifyStatus: UserVerifyStatus): Promise<string> {
    const forgotPasswordToken = await this.AuthService.signForgotPasswordToken({
      userId: userId.toString(),
      tokenType: TokenType.ForgotPasswordToken,
      verifyStatus: verifyStatus
    })
    return forgotPasswordToken
  }

  private async saveRefreshToken(refreshToken: string, userId: string): Promise<void> {
    await this.PrismaService.create<RefreshTokenModel>(DbTables.REFRESH_TOKENS, {
      expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRES),
      token: refreshToken,
      userId
    })
  }

  private async isExistRefreshToken(refreshToken: string): Promise<RefreshTokenModel> {
    return await this.PrismaService.findFirst<RefreshTokenModel>(DbTables.REFRESH_TOKENS, { token: refreshToken })
  }

  private async validateFollowOperation(targetUserId: string, currentUserId: string, type: 'follow' | 'unfollow') {
    if (!ObjectId.isValid(targetUserId)) {
      throwErrors('INVALID_USER_ID')
    }
    if (targetUserId == currentUserId) {
      if (type == 'follow') {
        throwErrors('CANNOT_FOLLOW_YOURSELF')
      } else {
        throwErrors('CANNOT_UNFOLLOW_YOURSELF')
      }
    }

    const [currentUser, targetUser, followRelation] = await Promise.all([
      this.PrismaService.findUnique<UserModel>(DbTables.USERS, { id: currentUserId }),
      this.PrismaService.findUnique<UserModel>(DbTables.USERS, { id: targetUserId }),
      this.PrismaService.findFirst<FollowersModel>(DbTables.FOLLOWERS, {
        userId: currentUserId,
        followedUserId: targetUserId
      })
    ])

    if (!targetUser || !currentUser) {
      throwErrors('USER_NOT_FOUND')
    }

    return { targetUser, followRelation }
  }
}
