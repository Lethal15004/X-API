"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../container"));
const router = (0, express_1.Router)();
// Controllers
const static_controllers_1 = require("../controllers/static.controllers");
// Get controllers and middlewares
const staticController = container_1.default.get(static_controllers_1.StaticController);
router.get('/images/:nameImage', staticController.serveImageController);
router.get('/videos/:nameVideo', staticController.serveVideoController);
exports.default = router;
