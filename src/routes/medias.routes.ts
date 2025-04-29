import { Router } from 'express'
import container from '~/container'
const router: Router = Router()

// Controller
import { MediaController } from '~/controllers/medias.controllers'

// Utils
import wrapHandler from '~/utils/handlers.utils'

// Get controllers and middlewares
const mediaController = container.get<MediaController>(MediaController)

router.post('/upload-image', wrapHandler(mediaController.uploadSingleImage))

export default router
