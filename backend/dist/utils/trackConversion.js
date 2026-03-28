"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackConversion = void 0;
const analytics_model_1 = __importDefault(require("../models/analytics.model"));
const trackConversion = async () => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        await analytics_model_1.default.findOneAndUpdate({ date: today }, { $inc: { conversions: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    catch (error) {
        console.error("[Analytics] Conversion logging natively failed:", error);
    }
};
exports.trackConversion = trackConversion;
