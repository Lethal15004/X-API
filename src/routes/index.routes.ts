import { Express } from 'express'

// Routes
import usersRoutes from '~/routes/users.routes'
import mediasRoutes from '~/routes/medias.routes'
import staticRoutes from '~/routes/static.routes'

const routesAPI = (app: Express) => {
  app.use('/users', usersRoutes)
  app.use('/medias', mediasRoutes)
  app.use('/static', staticRoutes)
}
export default routesAPI
