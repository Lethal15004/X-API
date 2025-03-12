import { Response, Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

// Type in models for requests
import { UserRegisterBody, UserLoginBody } from '~/models/requests/users.requests'

// Services
import * as usersServices from '~/services/users.services'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerController = async (req: Request<ParamsDictionary, any, UserRegisterBody>, res: Response) => {
  try {
    const user = await usersServices.register(req.body)
    if (user) {
      res.status(201).json({ message: 'User registered successfully', id: user.id })
    } else {
      res.status(400).json({ message: 'User registered failed' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}
export const loginController = async (req: Request<ParamsDictionary, any, UserLoginBody>, res: Response) => {
  const result = await usersServices.login(req.body)
  if (result) {
    res.status(201).json({ message: 'User login successfully' })
  } else {
    res.status(400).json({ message: 'User login failed' })
  }
}
