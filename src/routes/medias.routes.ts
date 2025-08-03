import { Router } from 'express'
import container from '~/container'
const router: Router = Router()

// Controller
import { MediaController } from '~/controllers/medias.controllers'

// Middlewares
import { UserMiddleware } from '~/middlewares/users.middlewares'

// Utils
import wrapHandler from '~/utils/handlers.utils'

// Get controllers and middlewares
const mediaController = container.get<MediaController>(MediaController)
const userMiddleware = container.get<UserMiddleware>(UserMiddleware)

router.post(
  '/upload-image',
  wrapHandler(userMiddleware.accessTokenValidator()),
  wrapHandler(userMiddleware.verifiedUserValidator),
  wrapHandler(mediaController.uploadImages)
)

router.post(
  '/upload-video',
  wrapHandler(userMiddleware.accessTokenValidator()),
  wrapHandler(userMiddleware.verifiedUserValidator),
  wrapHandler(mediaController.uploadVideo)
)

export default router
