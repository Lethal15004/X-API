"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Models
const Errors_1 = require("../models/Errors");
const wrapHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const entityError = new Errors_1.ErrorEntity({ errors: {} });
                for (const tmp of error.issues) {
                    entityError.errors[tmp.path[0]] = {
                        message: tmp.message,
                        code: tmp.code
                    };
                }
                next(entityError);
            }
            else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                const target = error.meta?.target;
                const modelName = error.meta?.modelName;
                switch (error.code) {
                    case 'P2002': {
                        // Trùng khóa unique
                        const entityError = new Errors_1.ErrorEntity({
                            errors: {
                                [modelName]: {
                                    message: `${target} already exists`,
                                    code: 'UNIQUE_CONSTRAINT'
                                }
                            }
                        });
                        next(entityError);
                        break;
                    }
                    case 'P2025': {
                        // Không tìm thấy bản ghi để update/delete
                        const entityError = new Errors_1.ErrorEntity({
                            errors: {
                                [modelName]: {
                                    message: `Resource not found or already deleted`,
                                    code: 'NOT_FOUND'
                                }
                            }
                        });
                        next(entityError);
                        break;
                    }
                    case 'P2003': {
                        // Vi phạm foreign key
                        const entityError = new Errors_1.ErrorEntity({
                            errors: {
                                [modelName]: {
                                    message: `Foreign key constraint failed`,
                                    code: 'FOREIGN_KEY_CONSTRAINT'
                                }
                            }
                        });
                        next(entityError);
                        break;
                    }
                    default: {
                        // Các lỗi Prisma khác
                        next(error);
                        break;
                    }
                }
            }
            else {
                next(error);
            }
        }
    };
};
exports.default = wrapHandler;
