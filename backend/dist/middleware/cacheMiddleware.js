"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const cache = (keyPrefix, ttl) => {
    return async (req, res, next) => {
        try {
            if (!redis_1.default.isReady) {
                return next();
            }
            const key = `${keyPrefix}:${req.originalUrl || req.url}`;
            const cachedData = await redis_1.default.get(key);
            if (cachedData) {
                res.status(200).json(JSON.parse(cachedData));
                return;
            }
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                redis_1.default.setEx(key, ttl, JSON.stringify(body)).catch(console.error);
                return originalJson(body);
            };
            next();
        }
        catch (error) {
            console.error('Cache Intercept Error:', error);
            next();
        }
    };
};
exports.cache = cache;
