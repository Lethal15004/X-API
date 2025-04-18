// Models
import { ErrorWithStatus } from '~/models/Errors'

// Constants
import { ErrorMap } from '~/constants/errors'

const throwErrors = (type: ErrorType) => {
  const error = ErrorMap[type]
  throw new ErrorWithStatus(error)
}

export default throwErrors
