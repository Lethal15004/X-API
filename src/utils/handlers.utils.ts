import { Request, Response, NextFunction, RequestHandler } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

// Models
import { ErrorEntity } from '~/models/Errors'

const wrapHandler = <P>(fn: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
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
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const target = error.meta?.target as string
        const modelName = error.meta?.modelName as string
        switch (error.code) {
          case 'P2002': {
            // Trùng khóa unique
            const entityError = new ErrorEntity({
              errors: {
                [modelName]: {
                  message: `${target} already exists`,
                  code: 'UNIQUE_CONSTRAINT'
                }
              }
            })
            next(entityError)
            break
          }

          case 'P2025': {
            // Không tìm thấy bản ghi để update/delete
            const entityError = new ErrorEntity({
              errors: {
                [modelName]: {
                  message: `Resource not found or already deleted`,
                  code: 'NOT_FOUND'
                }
              }
            })
            next(entityError)
            break
          }

          case 'P2003': {
            // Vi phạm foreign key
            const entityError = new ErrorEntity({
              errors: {
                [modelName]: {
                  message: `Foreign key constraint failed`,
                  code: 'FOREIGN_KEY_CONSTRAINT'
                }
              }
            })
            next(entityError)
            break
          }
          default: {
            // Các lỗi Prisma khác
            next(error)
            break
          }
        }
      } else {
        next(error)
      }
    }
  }
}
export default wrapHandler
