import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { inject, injectable } from 'inversify'

// Constants
import { TYPES_SERVICE } from '~/constants/types'

// Models
import { ErrorEntity } from '~/models/Errors'

// Utils
import throwErrors from '~/utils/throwErrors.utils'

// Interfaces
import { IAuthService } from '~/interfaces/IAuthService'

/**
 * Middleware run validation by Zod
 * @param schema - Schema of Zod to validate
 */
@injectable()
export class UserMiddleware {
  constructor(@inject(TYPES_SERVICE.AuthService) private readonly AuthService: IAuthService) {}

  public loginAndRegisterValidator = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.parseAsync(req[source])
        next()
      } catch (error) {
        if (error instanceof ZodError) {
          const entityError = new ErrorEntity({ errors: {} })
          for (const tmp of error.issues) {
            entityError.errors[tmp.path[0]] = {
              message: tmp.message,
              code: tmp.code
            }
          }
          next(entityError)
          return
        }
      }
    }
  }

  public authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer')) {
        throwErrors('UNAUTHORIZED')
        return
      }
      const accessToken = authHeader?.split(' ')[1]
      if (!accessToken) {
        throwErrors('UNAUTHORIZED')
        return
      }
      try {
        const decoded_authorization = await this.AuthService.verifyToken(accessToken as string)
        req.decoded_authorization = decoded_authorization
        next()
      } catch (error) {
        console.log(error)
        throwErrors('INVALID_TOKEN')
      }
    } catch (error) {
      next(error)
    }
  }
}
