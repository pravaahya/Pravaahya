"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const multer_1 = __importDefault(require("multer"));
// Vercel Serverless functions inherently block local OS disk-writes (EROFS).
// Bypassing to RAM Buffers natively for direct Database Base64 ingestion.
const storage = multer_1.default.memoryStorage();
exports.uploadFiles = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB cap structurally
});
