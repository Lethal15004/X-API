import { Response, Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { inject, injectable } from 'inversify'
import { IncomingMessage } from 'http'

// Constants
import { MEDIAS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/http-status'
import { TYPES_SERVICE } from '~/constants/types'

// Interfaces
import { IMediaService } from '~/interfaces/IMediaService'

@injectable()
export class MediaController {
  constructor(@inject(TYPES_SERVICE.MediaService) private readonly MediaService: IMediaService) {}

  public uploadImages = async (req: Request, res: Response) => {
    const result = await this.MediaService.uploadImages(req as IncomingMessage)
    if (result) {
      res.status(HTTP_STATUS.OK).json({
        message: MEDIAS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
        result: result
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: MEDIAS_MESSAGES.UPLOAD_IMAGE_FAILED
      })
    }
  }

  public uploadVideo = async (req: Request, res: Response) => {
    const result = await this.MediaService.uploadVideo(req as IncomingMessage)
    if (result) {
      res.status(HTTP_STATUS.OK).json({
        message: MEDIAS_MESSAGES.UPLOAD_VIDEO_SUCCESS,
        result: result
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: MEDIAS_MESSAGES.UPLOAD_VIDEO_FAILED
      })
    }
  }
}
