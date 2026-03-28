"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const clearCache = async (prefix) => {
    try {
        if (!redis_1.default.isReady)
            return;
        const keys = await redis_1.default.keys(`${prefix}*`);
        if (keys.length > 0) {
            await redis_1.default.del(keys);
        }
    }
    catch (error) {
        console.error('Cache Invalidation Extinction Error:', error);
    }
};
exports.clearCache = clearCache;
