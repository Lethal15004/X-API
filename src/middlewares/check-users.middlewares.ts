import { Express, Request, Response, NextFunction } from 'express'

const checkUser = (req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ message: 'User not found' })
}

export default checkUser
