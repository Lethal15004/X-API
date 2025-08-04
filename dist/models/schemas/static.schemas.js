"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameVideo = exports.NameImage = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../constants/schemas");
exports.NameImage = zod_1.z.object({
    nameImage: schemas_1.nameImage
});
exports.NameVideo = zod_1.z.object({
    nameVideo: schemas_1.nameVideo
});
