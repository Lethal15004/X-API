import { Request, Response, NextFunction } from 'express'

// Constants
import HTTP_STATUS from '~/constants/http-status'

// Models
import { ErrorEntity, ErrorWithStatus } from '~/models/Errors'

const defaultErrorHandler = (
  err: ErrorWithStatus | ErrorEntity | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ErrorWithStatus || err instanceof ErrorEntity) {
    res.status(err.getStatus() || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: err.getMessage() || 'Some thing went wrong',
      errors: err instanceof ErrorEntity ? err.getErrors() : undefined
    })
  } else {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: err.message || 'Some thing went wrong'
    })
  }
}

export default defaultErrorHandler
