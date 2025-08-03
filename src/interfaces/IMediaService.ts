import { IncomingMessage } from 'http'

export interface IMediaService {
  uploadImages(req: IncomingMessage): PromiseLike<object>
  uploadVideo(req: IncomingMessage): Promise<object>
}
