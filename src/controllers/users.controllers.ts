import { Response, Request } from 'express'

// Services
import * as usersServices from '~/services/users.services'

export const registerController = async (req: Request, res: Response) => {
  const result = await usersServices.register(req.body)
  if (result) {
    res.status(201).json({ message: 'User registered successfully' })
  } else {
    res.status(400).json({ message: 'User registered failed' })
  }
}
export const loginController = async (req: Request, res: Response) => {
  const result = await usersServices.login(req.body)
  if (result) {
    res.status(201).json({ message: 'User login successfully' })
  } else {
    res.status(400).json({ message: 'User login failed' })
  }
}
