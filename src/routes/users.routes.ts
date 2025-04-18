import { Router } from 'express'
import container from '~/container'
const router: Router = Router()

// Controllers
import { UserController } from '~/controllers/users.controllers'

// Middlewares
import { UserMiddleware } from '~/middlewares/users.middlewares'

// Schemas
import {
  UserRegisterSchema,
  UserLoginSchema,
  UserForgotPasswordSchema,
  UserUpdateSchema,
  UserFollowSchema
} from '~/models/schemas/users.schemas'

// Utils
import wrapHandler from '~/utils/handlers.utils'

// Get controllers and middlewares
const userController = container.get<UserController>(UserController)
const userMiddleware = container.get<UserMiddleware>(UserMiddleware)

router.get('/me', wrapHandler(userMiddleware.accessTokenValidator()), wrapHandler(userController.getMe))
router.get('/:username', wrapHandler(userController.getProfile))

router.patch(
  '/me',
  wrapHandler(userMiddleware.accessTokenValidator()),
  wrapHandler(userMiddleware.verifiedUserValidator),
  wrapHandler(userMiddleware.defaultValidator(UserUpdateSchema)),
  wrapHandler(userController.updateMe)
)

router.post(
  '/register',
  wrapHandler(userMiddleware.defaultValidator(UserRegisterSchema)),
  wrapHandler(userController.register)
)

router.post('/login', wrapHandler(userMiddleware.defaultValidator(UserLoginSchema)), wrapHandler(userController.login))

router.post('/logout', wrapHandler(userMiddleware.logOutValidator()), wrapHandler(userController.logout))

router.post(
  '/verify-email',
  wrapHandler(userMiddleware.verifyEmailValidator()),
  wrapHandler(userController.emailVerify)
)

router.post(
  '/resend-verify-email',
  wrapHandler(userMiddleware.accessTokenValidator()),
  wrapHandler(userController.resendEmailVerify)
)

router.post(
  '/forgot-password',
  wrapHandler(userMiddleware.defaultValidator(UserForgotPasswordSchema)),
  wrapHandler(userController.forgotPassword)
)

router.post(
  '/verify-forgot-password',
  wrapHandler(userMiddleware.verifyForgotPasswordValidator()),
  wrapHandler(userController.verifyForgotPassword)
)

router.post(
  '/reset-password',
  wrapHandler(userMiddleware.resetPasswordValidator()),
  wrapHandler(userController.resetPassword)
)

router.post(
  '/follow',
  wrapHandler(userMiddleware.accessTokenValidator()),
  wrapHandler(userMiddleware.verifiedUserValidator),
  wrapHandler(userMiddleware.defaultValidator(UserFollowSchema)),
  wrapHandler(userController.follow)
)

export default router
