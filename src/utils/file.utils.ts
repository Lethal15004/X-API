import fs from 'fs'
import path from 'path'

// Constants
import { UPLOAD_TEMP_DIR } from '~/constants/dir'

const initFolder = () => {
  const uploadFolderPath = UPLOAD_TEMP_DIR
  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, {
      recursive: true // Create folder nested
    })
  }
}

export const getFileName = (nameFile: string): string => {
  const splitNameFile = nameFile.split('.')
  splitNameFile.pop()
  return splitNameFile.join('')
}

export default initFolder
