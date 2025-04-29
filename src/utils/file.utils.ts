import fs from 'fs'
import path from 'path'

const initFolder = () => {
  const uploadFolderPath = path.resolve('uploads')
  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, {
      recursive: true // Create folder nested
    })
  }
}

export default initFolder
