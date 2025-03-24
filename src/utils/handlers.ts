import { Request, Response, NextFunction, RequestHandler } from 'express'
import { ZodError } from 'zod'

// Models
import { ErrorEntity } from '~/models/Errors'

const wrapHandler = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
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
      next(error)
    }
  }
}
export default wrapHandler
