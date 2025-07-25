import { injectable, inject } from 'inversify'
import formidable from 'formidable'
import path, { resolve } from 'path'
import { IncomingMessage } from 'http'
import sharp from 'sharp'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

// Configs
import { isProduction } from '~/config/config'

// Constants
import { UPLOAD_TEMP_DIR, UPLOAD_DIR } from '~/constants/dir'
import { getFileName } from '~/utils/file.utils'

// Interface
import { IMediaService } from '~/interfaces/IMediaService'
import { reject } from 'lodash'

@injectable()
export class MediaService implements IMediaService {
  constructor() {}
  public async uploadImage(req: IncomingMessage): Promise<string> {
    const form = formidable({
      uploadDir: UPLOAD_TEMP_DIR,
      maxFiles: 1,
      keepExtensions: true,
      maxFileSize: 300 * 1024,
      filter: function ({ name, originalFilename, mimetype }) {
        const valid = name === 'image' && mimetype?.includes('image/')
        if (!valid) {
          form.emit('error' as any, new Error('File type is not valid') as any)
        }
        return !!valid
      }
    })
    return new Promise<string>((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) return reject(err)
        if (!files.image) {
          return reject(new Error('File is not empty'))
        }
        const imageFile = Array.isArray(files.image) ? files.image[0] : files.image
        const newNameFile = getFileName(imageFile.newFilename)
        const newPath = path.resolve(UPLOAD_DIR, `${newNameFile}.jpg`)
        await sharp(imageFile.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(imageFile.filepath)
        return resolve(
          isProduction
            ? `${process.env.HOST}/medias/${newNameFile}.jpg`
            : `http://localhost:${process.env.PORT}/uploads/${newNameFile}.jpg`
        )
      })
    })
  }
}
