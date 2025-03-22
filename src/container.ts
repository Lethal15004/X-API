import 'reflect-metadata'

import { Container } from 'inversify'
import { TYPES_CONTROLLER, TYPES_SERVICE, TYPES_MIDDLEWARE } from './constants/types'

// Services
import { PrismaService } from './services/prisma.services'
import { AuthService } from './services/auth.services'
import { UserService } from './services/users.services'

// Interfaces
import { IUserService } from './interfaces/IUserService'
import { IPrismaService } from './interfaces/IPrismaService'
import { IAuthService } from './interfaces/IAuthService'

// Controllers
import { UserController } from './controllers/users.controllers'

// Middlewares
import { UserMiddleware } from './middlewares/users.middlewares'

const container = new Container({ defaultScope: 'Singleton' })

// Services need Interface
container.bind<IUserService>(TYPES_SERVICE.UserService).to(UserService).inSingletonScope()
container.bind<IPrismaService>(TYPES_SERVICE.PrismaService).to(PrismaService).inSingletonScope()
container.bind<IAuthService>(TYPES_SERVICE.AuthService).to(AuthService).inSingletonScope()

// Middlewares no need Interface
container.bind<UserMiddleware>(UserMiddleware).toSelf().inSingletonScope()

// Controllers no need Interface
container.bind<UserController>(UserController).toSelf().inSingletonScope()

export default container
