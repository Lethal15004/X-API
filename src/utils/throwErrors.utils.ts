// Models
import { ErrorWithStatus } from '~/models/Errors'

// Constants
import { errorMap } from '~/constants/errors'

const throwErrors = (type: ErrorType) => {
  const error = errorMap[type]
  throw new ErrorWithStatus(error)
}

export default throwErrors
