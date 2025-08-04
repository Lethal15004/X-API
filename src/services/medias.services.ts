import { injectable, inject } from 'inversify'
import formidable from 'formidable'
import path, { resolve } from 'path'
import { IncomingMessage } from 'http'
import sharp from 'sharp'
import fs from 'fs'
import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config()

// Configs
import { isProduction } from '~/config/config'
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Constants
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { getFileName } from '~/utils/file.utils'
import { MediaType } from '~/constants/enums'

// Interface
import { IMediaService } from '~/interfaces/IMediaService'

@injectable()
export class MediaService implements IMediaService {
  constructor() {}
  public async uploadImages(req: IncomingMessage): Promise<object> {
    const form = formidable({
      uploadDir: UPLOAD_IMAGE_TEMP_DIR,
      maxFiles: 4,
      keepExtensions: true,
      maxFileSize: 300 * 1024,
      maxTotalFileSize: 300 * 1024 * 4,
      filter: function ({ name, originalFilename, mimetype }) {
        const valid = name === 'image' && mimetype?.includes('image/')
        if (!valid) {
          form.emit('error' as any, new Error('File type is not valid') as any)
        }
        return !!valid
      }
    })
    return new Promise<object>((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) return reject(err)
        if (!files.image) {
          return reject(new Error('File is empty'))
        }
        const urlImage = await Promise.all(
          files.image.map(async (file) => {
            const newNameFile = getFileName(file.newFilename)
            const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newNameFile}.jpg`)
            await sharp(file.filepath).jpeg().toFile(newPath)

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(file.filepath, {
              folder: 'twitter-clone/images'
            })

            fs.unlinkSync(file.filepath)
            return {
              url: isProduction
                ? result.secure_url
                : `http://localhost:${process.env.PORT}/static/images/${newNameFile}`,
              type: MediaType.Image
            }
          })
        )
        resolve(urlImage)
      })
    })
  }

  public async uploadVideo(req: IncomingMessage): Promise<object> {
    const form = formidable({
      uploadDir: UPLOAD_VIDEO_DIR,
      maxFiles: 1,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024,
      filter: function ({ name, originalFilename, mimetype }) {
        const valid = name === 'video' && mimetype?.includes('video/')
        if (!valid) {
          form.emit('error' as any, new Error('File type is not valid') as any)
        }
        return !!valid
      }
    })
    return new Promise<object>((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) return reject(err)
        if (!files.video) {
          return reject(new Error('File is empty'))
        }
        const newNameFile = getFileName(files.video[0].newFilename)
        const result = await cloudinary.uploader.upload(files.video[0].filepath, {
          folder: 'twitter-clone/videos',
          resource_type: 'video'
        })
        resolve({
          url: isProduction ? result.secure_url : `http://localhost:${process.env.PORT}/static/videos/${newNameFile}`,
          type: MediaType.Video
        })
      })
    })
  }
}
