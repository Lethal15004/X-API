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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const inversify_1 = require("inversify");
const formidable_1 = __importDefault(require("formidable"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config();
// Configs
const config_1 = require("../config/config");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Constants
const dir_1 = require("../constants/dir");
const file_utils_1 = require("../utils/file.utils");
const enums_1 = require("../constants/enums");
let MediaService = class MediaService {
    constructor() { }
    async uploadImages(req) {
        const form = (0, formidable_1.default)({
            uploadDir: dir_1.UPLOAD_IMAGE_TEMP_DIR,
            maxFiles: 4,
            keepExtensions: true,
            maxFileSize: 300 * 1024,
            maxTotalFileSize: 300 * 1024 * 4,
            filter: function ({ name, originalFilename, mimetype }) {
                const valid = name === 'image' && mimetype?.includes('image/');
                if (!valid) {
                    form.emit('error', new Error('File type is not valid'));
                }
                return !!valid;
            }
        });
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                if (err)
                    return reject(err);
                if (!files.image) {
                    return reject(new Error('File is empty'));
                }
                const urlImage = await Promise.all(files.image.map(async (file) => {
                    const newNameFile = (0, file_utils_1.getFileName)(file.newFilename);
                    const newPath = path_1.default.resolve(dir_1.UPLOAD_IMAGE_DIR, `${newNameFile}.jpg`);
                    await (0, sharp_1.default)(file.filepath).jpeg().toFile(newPath);
                    // Upload to Cloudinary
                    const result = await cloudinary_1.v2.uploader.upload(file.filepath, {
                        folder: 'twitter-clone/images'
                    });
                    fs_1.default.unlinkSync(file.filepath);
                    return {
                        url: config_1.isProduction
                            ? result.secure_url
                            : `http://localhost:${process.env.PORT}/static/images/${newNameFile}`,
                        type: enums_1.MediaType.Image
                    };
                }));
                resolve(urlImage);
            });
        });
    }
    async uploadVideo(req) {
        const form = (0, formidable_1.default)({
            uploadDir: dir_1.UPLOAD_VIDEO_DIR,
            maxFiles: 1,
            keepExtensions: true,
            maxFileSize: 50 * 1024 * 1024,
            filter: function ({ name, originalFilename, mimetype }) {
                const valid = name === 'video' && mimetype?.includes('video/');
                if (!valid) {
                    form.emit('error', new Error('File type is not valid'));
                }
                return !!valid;
            }
        });
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                if (err)
                    return reject(err);
                console.log(files);
                if (!files.video) {
                    return reject(new Error('File is empty'));
                }
                const newNameFile = (0, file_utils_1.getFileName)(files.video[0].newFilename);
                const result = await cloudinary_1.v2.uploader.upload(files.video[0].filepath, {
                    folder: 'twitter-clone/videos',
                    resource_type: 'video'
                });
                resolve({
                    url: config_1.isProduction ? result.secure_url : `http://localhost:${process.env.PORT}/static/videos/${newNameFile}`,
                    type: enums_1.MediaType.Video
                });
            });
        });
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], MediaService);
