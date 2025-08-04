"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("./constants/types");
// Services
const prisma_services_1 = require("./services/prisma.services");
const auth_services_1 = require("./services/auth.services");
const users_services_1 = require("./services/users.services");
const medias_services_1 = require("./services/medias.services");
// Controllers
const users_controllers_1 = require("./controllers/users.controllers");
const medias_controllers_1 = require("./controllers/medias.controllers");
const static_controllers_1 = require("./controllers/static.controllers");
// Middlewares
const users_middlewares_1 = require("./middlewares/users.middlewares");
const container = new inversify_1.Container({ defaultScope: 'Singleton' });
// Services need Interface
container.bind(types_1.TYPES_SERVICE.UserService).to(users_services_1.UserService).inSingletonScope();
container.bind(types_1.TYPES_SERVICE.PrismaService).to(prisma_services_1.PrismaService).inSingletonScope();
container.bind(types_1.TYPES_SERVICE.AuthService).to(auth_services_1.AuthService).inSingletonScope();
container.bind(types_1.TYPES_SERVICE.MediaService).to(medias_services_1.MediaService).inSingletonScope();
// Middlewares no need Interface
container.bind(users_middlewares_1.UserMiddleware).toSelf().inSingletonScope();
// Controllers no need Interface
container.bind(users_controllers_1.UserController).toSelf().inSingletonScope();
container.bind(medias_controllers_1.MediaController).toSelf().inSingletonScope();
container.bind(static_controllers_1.StaticController).toSelf().inSingletonScope();
exports.default = container;
