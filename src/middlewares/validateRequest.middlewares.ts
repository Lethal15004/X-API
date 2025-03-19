import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

// Models
import { ErrorEntity } from '~/models/Errors'

/**
 * Middleware run validation by Zod
 * @param schema - Schema of Zod to validate
 */
export const validateRequest =
  (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.parseAsync(req[source])
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
export default validateRequest
