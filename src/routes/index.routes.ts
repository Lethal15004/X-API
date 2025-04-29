import { Express } from 'express'

// Routes
import usersRoutes from '~/routes/users.routes'
import mediasRoutes from '~/routes/medias.routes'

const routesAPI = (app: Express) => {
  app.use('/users', usersRoutes)
  app.use('/medias', mediasRoutes)
}
export default routesAPI
