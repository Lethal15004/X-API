import { Router } from 'express'
import container from '~/container'
const router: Router = Router()

// Controllers
import { UserController } from '~/controllers/users.controllers'

// Middlewares
import { UserMiddleware } from '~/middlewares/users.middlewares'

// Schemas
import { UserRegisterSchema, UserLoginSchema } from '~/models/schemas/users.schemas'

// Utils
import wrapHandler from '~/utils/handlers'

// Get controllers and middlewares
const userController = container.get<UserController>(UserController)
const userMiddleware = container.get<UserMiddleware>(UserMiddleware)

router.post(
  '/register',
  wrapHandler(userMiddleware.loginAndRegisterValidator(UserRegisterSchema, 'body')),
  wrapHandler(userController.register)
)

router.post(
  '/login',
  wrapHandler(userMiddleware.loginAndRegisterValidator(UserLoginSchema, 'body')),
  wrapHandler(userController.login)
)

router.post(
  '/logout',
  wrapHandler(userMiddleware.accessTokenValidator),
  wrapHandler(userMiddleware.refreshTokenValidator),
  wrapHandler(userController.logout)
)

export default router
