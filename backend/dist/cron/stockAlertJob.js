"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startStockAlertCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const stockChecker_1 = require("../utils/stockChecker");
// Run autonomously every 15 minutes natively checking DB bounds
const startStockAlertCron = () => {
    node_cron_1.default.schedule("*/15 * * * *", async () => {
        console.log("[Cron:System] Executing logical threshold scan across active product inventory...");
        const lowStock = await (0, stockChecker_1.checkLowStock)();
        if (lowStock.length > 0) {
            console.warn(`[Cron:System] ALERT! Detected ${lowStock.length} items reaching critical depletion constraints!`);
        }
    });
};
exports.startStockAlertCron = startStockAlertCron;
