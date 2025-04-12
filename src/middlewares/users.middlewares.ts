import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { inject, injectable } from 'inversify'

// Constants
import { TYPES_SERVICE } from '~/constants/types'
import { TokenType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'

// Utils
import throwErrors from '~/utils/throwErrors.utils'
import { splitAccessToken } from '~/utils/splitToken.utils'

// Interfaces
import { IAuthService } from '~/interfaces/IAuthService'

// Schemas
import {
  UserLogoutSchema,
  UserResetPasswordSchema,
  UserVerifyEmailSchema,
  UserVerifyForgotPasswordSchema
} from '~/models/schemas/users.schemas'
import { ErrorWithStatus } from '~/models/Errors'

/**
 * Middleware run validation by Zod
 * @param schema - Schema of Zod to validate
 */
@injectable()
export class UserMiddleware {
  constructor(@inject(TYPES_SERVICE.AuthService) private readonly AuthService: IAuthService) {}

  public defaultValidator = (schema: ZodSchema, source: 'body' | 'query' | 'params' | 'headers' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
      req.body = await schema.parseAsync(req[source])
      next()
    }
  }

  public logOutValidator = (source: 'body' | 'query' | 'params' | 'headers' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { authorization } = req.headers
      const { refreshToken } = req[source]
      const rs = await UserLogoutSchema.safeParseAsync({ authorization, refreshToken })
      if (!rs.success) {
        throw new ErrorWithStatus({
          message: rs.error.errors[0].message as string,
          status: HTTP_STATUS.UNAUTHORIZED
        }) // Quăng lỗi đầu tiên
      }
      const [decoded_authorization, decoded_refreshToken] = await this.decodeAccessRefreshToken(
        rs.data.authorization,
        rs.data.refreshToken
      )
      req.decoded_refresh_token = decoded_refreshToken
      req.decoded_authorization = decoded_authorization
      next()
    }
  }

  public verifyEmailValidator = (source: 'body' | 'query' | 'params' | 'headers' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { emailVerifyToken } = req[source]
      const rs = await UserVerifyEmailSchema.safeParseAsync({ emailVerifyToken })
      if (!rs.success) {
        throw new ErrorWithStatus({
          message: rs.error.errors[0].message as string,
          status: HTTP_STATUS.UNAUTHORIZED
        }) // Quăng lỗi đầu tiên
      }
      const decoded_email_verify_token = await this.decodeEmailVerifyToken(rs.data.emailVerifyToken)
      req.decoded_email_verify_token = decoded_email_verify_token
      next()
    }
  }

  public verifyForgotPasswordValidator = (source: 'body' | 'query' | 'params' | 'headers' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { forgotPasswordToken } = req[source]
      const rs = await UserVerifyForgotPasswordSchema.safeParseAsync({ forgotPasswordToken })
      if (!rs.success) {
        throw new ErrorWithStatus({
          message: rs.error.errors[0].message as string,
          status: HTTP_STATUS.UNAUTHORIZED
        }) // Quăng lỗi đầu tiên
      }
      const decoded_forgot_password_verify_token = await this.decodeForgotPasswordVerifyToken(
        rs.data.forgotPasswordToken
      )
      req.decoded_forgot_password_verify_token = decoded_forgot_password_verify_token
      next()
    }
  }

  public resetPasswordValidator = (source: 'body' | 'query' | 'params' | 'headers' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const rs = await UserResetPasswordSchema.safeParseAsync(req[source])
      if (!rs.success) {
        throw new ErrorWithStatus({
          message: rs.error.errors[0].message as string,
          status: HTTP_STATUS.UNAUTHORIZED
        }) // Quăng lỗi đầu tiên
      }
      const decoded_forgot_password_verify_token = await this.decodeForgotPasswordVerifyToken(
        rs.data.forgotPasswordToken
      )
      req.decoded_forgot_password_verify_token = decoded_forgot_password_verify_token
      next()
    }
  }

  public accessTokenValidator = (source: 'body' | 'query' | 'params' | 'headers' = 'headers') => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { authorization } = req.headers
      if (!authorization) {
        throwErrors('ACCESS_TOKEN_REQUIRED')
      }
      const splitAuthorization = splitAccessToken(authorization as string)
      const decoded_authorization = await this.decodeAccessToken(splitAuthorization as string)
      req.decoded_authorization = decoded_authorization
      next()
    }
  }

  private async decodeAccessRefreshToken(
    authorization: string,
    refreshToken: string
  ): Promise<[TokenPayload, TokenPayload]> {
    return await Promise.all([
      this.AuthService.verifyToken(authorization as string, TokenType.AccessToken),
      this.AuthService.verifyToken(refreshToken, TokenType.RefreshToken)
    ])
  }

  private async decodeAccessToken(authorization: string): Promise<TokenPayload> {
    return await this.AuthService.verifyToken(authorization as string, TokenType.AccessToken)
  }

  private async decodeRefreshToken(refreshToken: string): Promise<TokenPayload> {
    return await this.AuthService.verifyToken(refreshToken as string, TokenType.RefreshToken)
  }

  private async decodeEmailVerifyToken(emailVerifyToken: string): Promise<TokenPayload> {
    return await this.AuthService.verifyToken(emailVerifyToken as string, TokenType.EmailVerifyToken)
  }

  private async decodeForgotPasswordVerifyToken(forgotPasswordToken: string): Promise<TokenPayload> {
    return await this.AuthService.verifyToken(forgotPasswordToken as string, TokenType.ForgotPasswordToken)
  }
}
