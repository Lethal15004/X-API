"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticController = void 0;
const path_1 = __importDefault(require("path"));
// Constants
const dir_1 = require("../constants/dir");
class StaticController {
    serveImageController = async (req, res) => {
        const nameFile = req.params.nameImage;
        res.sendFile(path_1.default.resolve(dir_1.UPLOAD_IMAGE_DIR, nameFile + '.jpg'), (err) => {
            if (err) {
                res.status(err.status).send('Not found');
            }
        });
    };
    serveVideoController = async (req, res) => {
        const nameVideo = req.params.nameVideo;
        const filePath = path_1.default.resolve(dir_1.UPLOAD_VIDEO_DIR, nameVideo + '.mp4');
        res.sendFile(filePath, {
            headers: {
                'Content-Type': 'video/mp4',
                'Cache-Control': 'max-age=86400'
            }
        }, (err) => {
            if (err) {
                if (!res.headersSent) {
                    return res.status(err.status).send('Not found');
                }
                console.error('Error:', err);
            }
        });
    };
}
exports.StaticController = StaticController;
