"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_model_1 = __importDefault(require("../models/analytics.model"));
class AnalyticsController {
    getSummary = async (req, res) => {
        try {
            // Collect last 30 days securely mapping structural graphs sequentially
            const data = await analytics_model_1.default.find().sort({ date: -1 }).limit(30);
            let totalVisits = 0;
            let totalConversions = 0;
            data.forEach(d => {
                totalVisits += d.visits;
                totalConversions += d.conversions;
            });
            const conversionRate = totalVisits > 0
                ? ((totalConversions / totalVisits) * 100).toFixed(2)
                : "0.00";
            res.status(200).json({
                success: true,
                data: {
                    totalVisits,
                    totalConversions,
                    conversionRate,
                    daily: data.reverse() // Sort ascending for charts natively
                }
            });
        }
        catch (err) {
            res.status(500).json({ error: "Internal aggregation error processing matrices." });
        }
    };
}
exports.AnalyticsController = AnalyticsController;
