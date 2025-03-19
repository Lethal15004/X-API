import { Request, Response, NextFunction } from 'express'

// Constants
import HTTP_STATUS from '~/constants/httpStatus'

// Models
import { ErrorEntity } from '~/models/Errors'

const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.getStatus() || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.getMessage() || 'Some thing went wrong',
    errors: err instanceof ErrorEntity ? err.getErrors() : undefined
  })
}

export default defaultErrorHandler
