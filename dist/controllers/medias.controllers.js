"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const inversify_1 = require("inversify");
// Constants
const messages_1 = require("../constants/messages");
const http_status_1 = __importDefault(require("../constants/http-status"));
const types_1 = require("../constants/types");
let MediaController = class MediaController {
    MediaService;
    constructor(MediaService) {
        this.MediaService = MediaService;
    }
    uploadImages = async (req, res) => {
        const result = await this.MediaService.uploadImages(req);
        if (result) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.MEDIAS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
                result: result
            });
        }
        else {
            res.status(http_status_1.default.BAD_REQUEST).json({
                message: messages_1.MEDIAS_MESSAGES.UPLOAD_IMAGE_FAILED
            });
        }
    };
    uploadVideo = async (req, res) => {
        const result = await this.MediaService.uploadVideo(req);
        if (result) {
            res.status(http_status_1.default.OK).json({
                message: messages_1.MEDIAS_MESSAGES.UPLOAD_VIDEO_SUCCESS,
                result: result
            });
        }
        else {
            res.status(http_status_1.default.BAD_REQUEST).json({
                message: messages_1.MEDIAS_MESSAGES.UPLOAD_VIDEO_FAILED
            });
        }
    };
};
exports.MediaController = MediaController;
exports.MediaController = MediaController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES_SERVICE.MediaService)),
    __metadata("design:paramtypes", [Object])
], MediaController);
