import express, { Router } from 'express'
const router: Router = express.Router()

// Schemas Validator in models
import { UserRegisterSchema, UserLoginSchema } from '~/models/schemas/users.schemas'

// Middlewares
import validateRequest from '~/middlewares/validateRequest.middlewares'

// Controllers
import * as usersControllers from '~/controllers/users.controllers'

router.post('/register', validateRequest(UserRegisterSchema, 'body'), usersControllers.registerController)
router.post('/login', validateRequest(UserLoginSchema, 'body'), usersControllers.loginController)

export default router
