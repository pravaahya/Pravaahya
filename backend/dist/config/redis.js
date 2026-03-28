"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});
redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.connect().then(() => {
    console.log('Redis Cluster Connected Securely.');
}).catch(console.error);
exports.default = redisClient;
