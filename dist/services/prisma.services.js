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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const client_1 = require("@prisma/client");
const inversify_1 = require("inversify");
let PrismaService = class PrismaService {
    prisma;
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async findUnique(model, where, select) {
        this.checkModelExist(model);
        return this.prisma[model].findUnique({
            where,
            select
        });
    }
    async findFirst(model, where) {
        this.checkModelExist(model);
        return this.prisma[model].findFirst({
            where
        });
    }
    async findMany(model, where) {
        this.checkModelExist(model);
        return this.prisma[model].findMany({
            where
        });
    }
    async create(model, data) {
        this.checkModelExist(model);
        return this.prisma[model].create({
            data
        });
    }
    async update(model, where, data) {
        this.checkModelExist(model);
        return this.prisma[model].update({
            where,
            data
        });
    }
    async deleteMany(model, where) {
        this.checkModelExist(model);
        await this.prisma[model].deleteMany({
            where
        });
    }
    async deleteFirst(model, where) {
        this.checkModelExist(model);
        await this.prisma[model].delete({
            where
        });
    }
    checkModelExist(model) {
        if (!this.prisma[model]) {
            throw new Error(`Model ${model} không tồn tại trong Prisma`);
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
