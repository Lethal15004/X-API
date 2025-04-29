import 'reflect-metadata'

import { Container } from 'inversify'
import { TYPES_SERVICE } from './constants/types'

// Services
import { PrismaService } from './services/prisma.services'
import { AuthService } from './services/auth.services'
import { UserService } from './services/users.services'
import { MediaService } from './services/medias.services'

// Interfaces
import { IUserService } from './interfaces/IUserService'
import { IPrismaService } from './interfaces/IPrismaService'
import { IAuthService } from './interfaces/IAuthService'
import { IMediaService } from './interfaces/IMediaService'

// Controllers
import { UserController } from './controllers/users.controllers'
import { MediaController } from './controllers/medias.controllers'

// Middlewares
import { UserMiddleware } from './middlewares/users.middlewares'

const container = new Container({ defaultScope: 'Singleton' })

// Services need Interface
container.bind<IUserService>(TYPES_SERVICE.UserService).to(UserService).inSingletonScope()
container.bind<IPrismaService>(TYPES_SERVICE.PrismaService).to(PrismaService).inSingletonScope()
container.bind<IAuthService>(TYPES_SERVICE.AuthService).to(AuthService).inSingletonScope()
container.bind<IMediaService>(TYPES_SERVICE.MediaService).to(MediaService).inSingletonScope()

// Middlewares no need Interface
container.bind<UserMiddleware>(UserMiddleware).toSelf().inSingletonScope()

// Controllers no need Interface
container.bind<UserController>(UserController).toSelf().inSingletonScope()
container.bind<MediaController>(MediaController).toSelf().inSingletonScope()

export default container
