import express, { Router } from 'express'
const router: Router = express.Router()

// Middlewares
import * as usersMiddlewares from '~/middlewares/users.middlewares'

// Controllers
import * as usersControllers from '~/controllers/users.controllers'

router.post('/login', usersMiddlewares.loginValidator, usersControllers.loginController)
export default router
