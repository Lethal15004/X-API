import fs from 'fs'
import path from 'path'

// Constants
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      })
    }
  })
}

export const getFileName = (nameFile: string): string => {
  const splitNameFile = nameFile.split('.')
  splitNameFile.pop()
  return splitNameFile.join('')
}

export default initFolder
