import { IncomingMessage } from 'http'

export interface IMediaService {
  uploadImage(req: IncomingMessage): PromiseLike<string>
}
