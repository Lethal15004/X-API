import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { inject, injectable } from 'inversify'

// Constants
import { TYPES_SERVICE } from '~/constants/types'

// Utils
import throwErrors from '~/utils/throwErrors.utils'

// Interfaces
import { IAuthService } from '~/interfaces/IAuthService'
import { IPrismaService } from '~/interfaces/IPrismaService'

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

  public loginAndRegisterValidator = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
      schema.parseAsync(req[source])
      next()
    }
  }

  public accessTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throwErrors('UNAUTHORIZED')
      return
    }
    const accessToken = authHeader?.split(' ')[1]
    if (!accessToken) {
      throwErrors('ACCESS_TOKEN_REQUIRED')
      return
    }
    try {
      const decoded_authorization = await this.AuthService.verifyToken(accessToken as string)
      req.decoded_authorization = decoded_authorization
      next()
    } catch (error) {
      throwErrors('INVALID_ACCESS_TOKEN')
    }
  }

  public refreshTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.body.refreshToken
    if (!refreshToken) {
      throwErrors('REFRESH_TOKEN_REQUIRED')
      return
    }
    try {
      const [decoded_refresh_token, refresh_token] = await Promise.all([
        this.AuthService.verifyToken(refreshToken as string),
        this.PrismaService.findFirst<RefreshTokenModel>('refresh_Tokens', {
          token: refreshToken
        })
      ])
      req.decoded_refresh_token = decoded_refresh_token
      if (!refresh_token) {
        throwErrors('USED_REFRESH_TOKEN_OR_NOT_EXISTS')
        return
      }
      next()
    } catch (error) {
      throwErrors('INVALID_REFRESH_TOKEN')
    }
  }
}
