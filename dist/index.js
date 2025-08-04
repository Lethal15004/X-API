"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = `${process.env.PORT}`;
// Config
const config_1 = require("./config/config");
// Swagger definition
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Twitter API',
            version: '1.0.0',
            description: 'Twitter API documentation'
        }
    },
    servers: [
        {
            url: config_1.isProduction ? process.env.PRODUCTION_SERVER : 'http://localhost:3000',
            description: config_1.isProduction ? 'Production server' : 'Development server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    apis: ['./src/routes/*.routes.ts', './src/utils/swagger.utils.ts']
};
// Routes
const index_routes_1 = __importDefault(require("./routes/index.routes"));
// Error Handler
const error_middlewares_1 = __importDefault(require("./middlewares/error.middlewares"));
// Init Upload Folder
const file_utils_1 = __importDefault(require("./utils/file.utils"));
(0, file_utils_1.default)();
// Cors
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
// Swagger setup
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
const swaggerUiOptions = {
    swaggerOptions: {
        oauth2RedirectUrl: config_1.isProduction ? process.env.GOOGLE_REDIRECT_URI_PRODUCTION : process.env.GOOGLE_REDIRECT_URI,
        persistAuthorization: true,
        docExpansion: 'list',
        defaultModelsExpandDepth: -1
    }
};
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, swaggerUiOptions));
app.use(express_1.default.json());
(0, index_routes_1.default)(app);
// Error Handler
app.use(error_middlewares_1.default);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
