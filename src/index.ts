import express, { Express, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import routesAPI from '~/routes/index.routes'
dotenv.config()

const app: Express = express()
const port: number | string = `${process.env.PORT}`

// Services
import { UsersService } from '~/services/users.services'
export const usersService = UsersService.getInstance()

app.use(express.json())
routesAPI(app)

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ message: err.message })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
