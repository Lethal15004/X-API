import { Express } from 'express'
import UserRoutes from '~/routes/user.routes'
const routesAPI = (app: Express) => {
  app.use('/users', UserRoutes)
}
export default routesAPI
