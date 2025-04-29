import { injectable, inject } from 'inversify'
import formidable from 'formidable'
import path from 'path'
import { IncomingMessage } from 'http'

// Interface
import { IMediaService } from '~/interfaces/IMediaService'

@injectable()
export class MediaService implements IMediaService {
  private readonly pathUpload = path.resolve('uploads')
  constructor() {}
  public async uploadImage(req: IncomingMessage): Promise<boolean> {
    const form = formidable({ uploadDir: this.pathUpload, maxFiles: 1, keepExtensions: true, maxFileSize: 300 * 1024 })
    form.parse(req, (err, fields, files) => {
      if (err) {
        throw err
      }
    })
    return true
  }
}
