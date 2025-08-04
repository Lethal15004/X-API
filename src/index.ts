import 'reflect-metadata'
import express, { Express } from 'express'
import dotenv from 'dotenv'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'

dotenv.config()

const app: Express = express()
const port: number | string = `${process.env.PORT}`

// Config
import { isProduction } from './config/config'

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Twitter API',
      version: '1.0.0',
      description: 'Twitter API documentation'
    }
  },
  servers: [
    {
      url: isProduction ? process.env.HOST : 'http://localhost:3000',
      description: isProduction ? 'Production server' : 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  apis: ['./src/routes/*.routes.ts', './src/utils/swagger.utils.ts']
}

// Routes
import routesAPI from '~/routes/index.routes'

// Error Handler
import defaultErrorHandler from '~/middlewares/error.middlewares'

// Init Upload Folder
import initFolder from './utils/file.utils'
initFolder()

// Cors
app.use(
  cors({
    origin: true,
    credentials: true
  })
)

// Swagger setup
const swaggerSpec = swaggerJSDoc(swaggerOptions)
const swaggerUiOptions = {
  swaggerOptions: {
    oauth2RedirectUrl: isProduction ? process.env.GOOGLE_REDIRECT_URI_PRODUCTION : process.env.GOOGLE_REDIRECT_URI,
    persistAuthorization: true,
    docExpansion: 'list',
    defaultModelsExpandDepth: -1
  }
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

app.use(express.json())
routesAPI(app)

// Error Handler
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
