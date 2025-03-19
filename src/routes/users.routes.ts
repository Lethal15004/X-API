import { Router } from 'express'
const router: Router = Router()

// Schemas
import { UserRegisterSchema, UserLoginSchema } from '~/models/schemas/users.schemas'

// Middlewares
import validateRequest from '~/middlewares/validateRequest.middlewares'

// Controllers
import * as usersControllers from '~/controllers/users.controllers'

// Utils
import wrapHandler from '~/utils/handlers'

router.post('/register', validateRequest(UserRegisterSchema, 'body'), wrapHandler(usersControllers.register))
router.post('/login', validateRequest(UserLoginSchema, 'body'), wrapHandler(usersControllers.login))

export default router
