"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileName = void 0;
const fs_1 = __importDefault(require("fs"));
// Constants
const dir_1 = require("../constants/dir");
const initFolder = () => {
    ;
    [dir_1.UPLOAD_IMAGE_TEMP_DIR, dir_1.UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, {
                recursive: true
            });
        }
    });
};
const getFileName = (nameFile) => {
    const splitNameFile = nameFile.split('.');
    splitNameFile.pop();
    return splitNameFile.join('');
};
exports.getFileName = getFileName;
exports.default = initFolder;
