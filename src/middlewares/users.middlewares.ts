import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { inject, injectable } from 'inversify'

// Constants
import { TYPES_SERVICE } from '~/constants/types'
import { TokenType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'

// Utils
import throwErrors from '~/utils/throwErrors.utils'

// Interfaces
import { IAuthService } from '~/interfaces/IAuthService'
import { IPrismaService } from '~/interfaces/IPrismaService'

// Schemas
import { UserLogoutSchema, UserVerifyEmailSchema } from '~/models/schemas/users.schemas'
import { ErrorWithStatus } from '~/models/Errors'

/**
 * Middleware run validation by Zod
 * @param schema - Schema of Zod to validate
 */
@injectable()
export class UserMiddleware {
  constructor(
    @inject(TYPES_SERVICE.AuthService) private readonly AuthService: IAuthService,
    @inject(TYPES_SERVICE.PrismaService) private readonly PrismaService: IPrismaService
  ) {}

  public Validator = (schema: ZodSchema, source: 'body' | 'query' | 'params' | 'headers' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
      switch (schema) {
        case UserLogoutSchema: {
          const { authorization } = req.headers
          const { refreshToken } = req[source]
          const rs = await schema.safeParseAsync({ authorization, refreshToken })
          if (!rs.success) {
            throw new ErrorWithStatus({
              message: rs.error.errors[0].message as string,
              status: HTTP_STATUS.UNAUTHORIZED
            }) // Quăng lỗi đầu tiên
          }
          const [decoded_authorization, decoded_refreshToken, isExist] = await this.decodeAccessRefreshToken(
            rs.data.authorization,
            rs.data.refreshToken
          )
          if (isExist) {
            req.decoded_refresh_token = decoded_refreshToken
            req.decoded_authorization = decoded_authorization
            next()
          } else {
            throwErrors('USED_REFRESH_TOKEN_OR_NOT_EXISTS')
          }
          break
        }
        case UserVerifyEmailSchema: {
          const { emailVerifyToken } = req[source]
          const rs = await schema.safeParseAsync({ emailVerifyToken })
          if (!rs.success) {
            throw new ErrorWithStatus({
              message: rs.error.errors[0].message as string,
              status: HTTP_STATUS.UNAUTHORIZED
            }) // Quăng lỗi đầu tiên
          }
          const decoded_email_verify_token = await this.decodeEmailVerifyToken(rs.data.emailVerifyToken)
          req.decoded_email_verify_token = decoded_email_verify_token
          next()
          break
        }
        default: {
          req.body = await schema.parseAsync(req[source])
          next()
          break
        }
      }
    }
  }

  private async decodeAccessRefreshToken(
    authorization: string,
    refreshToken: string
  ): Promise<[TokenPayload, TokenPayload, RefreshTokenModel | null]> {
    return await Promise.all([
      this.AuthService.verifyToken(authorization as string, TokenType.AccessToken),
      this.AuthService.verifyToken(refreshToken, TokenType.RefreshToken),
      this.PrismaService.findFirst<RefreshTokenModel>('refresh_Tokens', { token: refreshToken })
    ])
  }

  private async decodeEmailVerifyToken(emailVerifyToken: string): Promise<TokenPayload> {
    return await this.AuthService.verifyToken(emailVerifyToken as string, TokenType.EmailVerifyToken)
  }
}
