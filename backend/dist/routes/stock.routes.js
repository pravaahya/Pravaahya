"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stock_controller_1 = require("../controllers/stock.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const stockController = new stock_controller_1.StockController();
// Target admin logic strictly isolating operational limits onto secured HTTP routes seamlessly
router.get('/low', auth_middleware_1.protect, auth_middleware_1.adminOnly, stockController.getLowStockEvents);
exports.default = router;
