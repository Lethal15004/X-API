import express, { Express } from 'express'
import dotenv from 'dotenv'
import routesAPI from '~/routes/index.routes'
dotenv.config()

const app: Express = express()
const port: number | string = `${process.env.PORT}`

routesAPI(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
