"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES_CONTROLLER = exports.TYPES_MIDDLEWARE = exports.TYPES_SERVICE = void 0;
exports.TYPES_SERVICE = {
    PrismaService: Symbol.for('PrismaService'),
    AuthService: Symbol.for('AuthService'),
    UserService: Symbol.for('UserService'),
    MediaService: Symbol.for('MediaService')
};
exports.TYPES_MIDDLEWARE = {
    UserMiddleware: Symbol.for('UserMiddleware')
};
exports.TYPES_CONTROLLER = {
    UserController: Symbol.for('UserController'),
    MediaController: Symbol.for('MediaController'),
    StaticController: Symbol.for('StaticController')
};
