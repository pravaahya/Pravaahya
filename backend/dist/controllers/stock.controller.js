"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
const stockChecker_1 = require("../utils/stockChecker");
class StockController {
    getLowStockEvents = async (req, res) => {
        try {
            const alerts = await (0, stockChecker_1.checkLowStock)();
            res.status(200).json({ success: true, count: alerts.length, data: alerts });
        }
        catch (err) {
            res.status(500).json({ error: "Failed to compile aggregate stock metrics natively." });
        }
    };
}
exports.StockController = StockController;
