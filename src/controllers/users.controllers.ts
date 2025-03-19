import { Response, Request, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

// Constants
import USERS_MESSAGES from '~/constants/messages'

// Services
import { usersService } from '~/index'

export const register = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: Request<ParamsDictionary, any, UserRegisterBody>,
  res: Response,
  next: NextFunction
) => {
  const userExist = await usersService.register(req.body)
  if (userExist) {
    res.status(201).json({
      message: USERS_MESSAGES.REGISTER_SUCCESS,
      id: userExist.user.id,
      accessToken: userExist.accessToken,
      refreshToken: userExist.refreshToken
    })
  } else {
    res.status(400).json({ message: 'User registered failed' })
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const login = async (req: Request<ParamsDictionary, any, UserLoginBody>, res: Response, next: NextFunction) => {
  const userExist = await usersService.login(req.body)
  if (userExist) {
    res.status(200).json({
      message: USERS_MESSAGES.LOGIN_SUCCESS,
      id: userExist.user.id,
      accessToken: userExist.accessToken,
      refreshToken: userExist.refreshToken
    })
  } else {
    res.status(400).json({ message: 'User login failed' })
  }
}
