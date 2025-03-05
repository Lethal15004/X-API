import { Response, Request } from 'express'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'Phamvahuy2004@gmail.com' && password === '123123az') {
    res.status(200).json({ message: 'Login successful' })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
}
