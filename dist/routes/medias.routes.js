"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../container"));
const router = (0, express_1.Router)();
// Controller
const medias_controllers_1 = require("../controllers/medias.controllers");
// Middlewares
const users_middlewares_1 = require("../middlewares/users.middlewares");
// Utils
const handlers_utils_1 = __importDefault(require("../utils/handlers.utils"));
// Get controllers and middlewares
const mediaController = container_1.default.get(medias_controllers_1.MediaController);
const userMiddleware = container_1.default.get(users_middlewares_1.UserMiddleware);
router.post('/upload-image', (0, handlers_utils_1.default)(userMiddleware.accessTokenValidator()), (0, handlers_utils_1.default)(userMiddleware.verifiedUserValidator), (0, handlers_utils_1.default)(mediaController.uploadImages));
router.post('/upload-video', (0, handlers_utils_1.default)(userMiddleware.accessTokenValidator()), (0, handlers_utils_1.default)(userMiddleware.verifiedUserValidator), (0, handlers_utils_1.default)(mediaController.uploadVideo));
exports.default = router;
