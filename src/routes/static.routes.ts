import { Router } from 'express'
import container from '~/container'
const router: Router = Router()

// Controllers
import { StaticController } from '~/controllers/static.controllers'

// Utils
import wrapHandler from '~/utils/handlers.utils'

// Get controllers and middlewares
const staticController = container.get<StaticController>(StaticController)

router.get('/images/:nameImage', staticController.serveImageController)
router.get('/videos/:nameVideo', staticController.serveVideoController)

export default router
