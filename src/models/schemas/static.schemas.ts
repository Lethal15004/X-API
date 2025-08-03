import { z } from 'zod'

// Constants
import { MEDIAS_MESSAGES } from '~/constants/messages'
import { nameImage, nameVideo } from '~/constants/schemas'

export const NameImage = z.object({
  nameImage: nameImage
})

export const NameVideo = z.object({
  nameVideo: nameVideo
})
