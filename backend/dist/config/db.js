"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dns_1 = __importDefault(require("dns"));
// Fix Windows DNS resolution issue for Atlas +srv connection strings by injecting global resolvers
dns_1.default.setServers(['8.8.8.8', '8.8.4.4']);
let cachedConn = null;
const connectDB = async () => {
    if (cachedConn) {
        return cachedConn;
    }
    if (mongoose_1.default.connection.readyState === 1) {
        cachedConn = mongoose_1.default;
        return mongoose_1.default;
    }
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }
        // Using simple options compatible with mongoose v6+ / v7+
        const conn = await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        cachedConn = conn;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    }
    catch (error) {
        console.error(`Warning: MongoDB connection failed natively -> ${error.message}`);
        console.error("The Express API will remain online, but database queries will time out mathematically until valid credentials are provided.");
        // Removed process.exit(1) to prevent the server from committing suicide when offline.
    }
};
exports.connectDB = connectDB;
