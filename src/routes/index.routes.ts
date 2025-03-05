import { Express } from 'express'
import usersRoutes from '~/routes/users.routes'
const routesAPI = (app: Express) => {
  app.use('/users', usersRoutes)
}
export default routesAPI
