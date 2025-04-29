export const TYPES_SERVICE = {
  PrismaService: Symbol.for('PrismaService'),
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),
  MediaService: Symbol.for('MediaService')
} as const

export const TYPES_MIDDLEWARE = {
  UserMiddleware: Symbol.for('UserMiddleware')
} as const

export const TYPES_CONTROLLER = {
  UserController: Symbol.for('UserController'),
  MediaController: Symbol.for('MediaController')
} as const
