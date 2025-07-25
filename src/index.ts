import 'reflect-metadata'
import express, { Express } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port: number | string = `${process.env.PORT}`

// Routes
import routesAPI from '~/routes/index.routes'

// Error Handler
import defaultErrorHandler from '~/middlewares/error.middlewares'

// Init Upload Folder
import initFolder from './utils/file.utils'
initFolder()

app.use(express.json())
routesAPI(app)

// Error Handler
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
