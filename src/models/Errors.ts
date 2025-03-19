// Constants
import HTTP_STATUS from '~/constants/httpStatus'
import USERS_MESSAGES from '~/constants/messages'

type ErrorsType = Record<
  string,
  {
    message: string
    code: string
    [key: string]: any
  }
> // Define type of errors

export class ErrorWithStatus {
  private message: string
  private status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
  public getMessage() {
    return this.message
  }
  public getStatus() {
    return this.status
  }
}
export class ErrorEntity extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ message, status, errors }: { message?: string; status?: number; errors: ErrorsType }) {
    super({ message: message || USERS_MESSAGES.VALIDATION_ERROR, status: status || HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
  public getErrors() {
    return this.errors
  }
}
