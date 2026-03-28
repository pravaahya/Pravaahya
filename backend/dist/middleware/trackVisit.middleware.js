"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackVisit = void 0;
const analytics_model_1 = __importDefault(require("../models/analytics.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const trackVisit = async (req, res, next) => {
    try {
        // Instantly drop tracking if network is rejecting IP
        if (mongoose_1.default.connection.readyState !== 1)
            return next();
        // Only track GET requests to public endpoints to avoid spamming internal admin bounds
        if (req.method === 'GET' && !req.path.includes('/admin') && !req.path.includes('/analytics')) {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0); // Normalize boundaries globally
            await analytics_model_1.default.findOneAndUpdate({ date: today }, { $inc: { visits: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }
    }
    catch (error) {
        console.error("[Analytics] Background tracking failed silently.", error);
    }
    next();
};
exports.trackVisit = trackVisit;
