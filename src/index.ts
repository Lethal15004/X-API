import 'reflect-metadata'
import express, { Express } from 'express'
import dotenv from 'dotenv'
import routesAPI from '~/routes/index.routes'
dotenv.config()

const app: Express = express()
const port: number | string = `${process.env.PORT}`

// Error Handler
import defaultErrorHandler from '~/middlewares/error.middlewares'

app.use(express.json())
routesAPI(app)

// Error Handler
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
