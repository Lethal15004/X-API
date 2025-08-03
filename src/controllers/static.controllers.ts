import { Response, Request } from 'express'
import path from 'path'

// Constants
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'

export class StaticController {
  public serveImageController = async (req: Request<NameImageParams>, res: Response) => {
    const nameFile = req.params.nameImage
    res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, nameFile + '.jpg'), (err) => {
      if (err) {
        res.status((err as any).status).send('Not found')
      }
    })
  }
  public serveVideoController = async (req: Request<NameVideoParams>, res: Response) => {
    const nameVideo = req.params.nameVideo
    const filePath = path.resolve(UPLOAD_VIDEO_DIR, nameVideo + '.mp4')
    res.sendFile(
      filePath,
      {
        headers: {
          'Content-Type': 'video/mp4',
          'Cache-Control': 'max-age=86400'
        }
      },
      (err) => {
        if (err) {
          if (!res.headersSent) {
            return res.status((err as any).status).send('Not found')
          }
          console.error('Error:', err)
        }
      }
    )
  }
}
