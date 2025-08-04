"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Routes
const users_routes_1 = __importDefault(require("../routes/users.routes"));
const medias_routes_1 = __importDefault(require("../routes/medias.routes"));
const static_routes_1 = __importDefault(require("../routes/static.routes"));
const routesAPI = (app) => {
    app.use('/users', users_routes_1.default);
    app.use('/medias', medias_routes_1.default);
    app.use('/static', static_routes_1.default);
};
exports.default = routesAPI;
