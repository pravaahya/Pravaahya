"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({ error: "Unauthorized: Token missing" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "super_secret_pravaahya_key_2026");
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
};
exports.protect = protect;
const adminOnly = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ error: "Forbidden: Admin access strictly required" });
        return;
    }
    next();
};
exports.adminOnly = adminOnly;
