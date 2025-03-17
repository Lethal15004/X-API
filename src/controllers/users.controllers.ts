import { Response, Request, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

// Type in models for requests
import { UserRegisterBody, UserLoginBody } from '~/models/requests/users.requests'

// Services
import { usersService } from '~/index'

export const register = async (
  req: Request<ParamsDictionary, any, UserRegisterBody>,
  res: Response,
  next: NextFunction
) => {
  const user = await usersService.register(req.body)
  if (user) {
    res.status(201).json({ message: 'User registered successfully', id: user['user']['id'] })
  } else {
    res.status(400).json({ message: 'User registered failed' })
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const login = async (req: Request<ParamsDictionary, any, UserLoginBody>, res: Response, next: NextFunction) => {
  const user = await usersService.login(req.body)
  if (user) {
    res.status(201).json({ message: 'User login successfully', id: user['id'] })
  } else {
    res.status(400).json({ message: 'User login failed' })
  }
}
