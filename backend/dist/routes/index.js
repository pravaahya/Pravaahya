"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const example_controller_1 = require("../controllers/example.controller");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const payment_routes_1 = __importDefault(require("./payment.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const stock_routes_1 = __importDefault(require("./stock.routes"));
const analytics_routes_1 = __importDefault(require("./analytics.routes"));
const collection_routes_1 = __importDefault(require("./collection.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const coupon_routes_1 = __importDefault(require("./coupon.routes"));
const router = (0, express_1.Router)();
const exampleController = new example_controller_1.ExampleController();
const mongoose_1 = __importDefault(require("mongoose"));
// Global Mongoose Offline Resilience Interceptor
router.use((req, res, next) => {
    if (mongoose_1.default.connection.readyState !== 1 && req.method === 'GET') {
        const p = req.path;
        if (p.includes('/admin/insights')) {
            return res.status(200).json({
                success: true,
                data: { totalOrders: 0, totalRevenue: 0, totalUsers: 0, monthlyOrders: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], monthlyRevenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
            });
        }
        if (p.includes('/products') || p.includes('/orders') || p.includes('/collections')) {
            return res.status(200).json({ success: true, count: 0, products: [], data: [], orders: [] });
        }
        if (p.includes('/coupons/featured')) {
            return res.status(200).json({ success: true, data: null });
        }
        if (p.includes('/coupons')) {
            return res.status(200).json({ success: true, data: [] });
        }
        if (p.includes('/analytics/summary')) {
            return res.status(200).json({
                success: true,
                data: { totalVisits: 0, totalConversions: 0, conversionRate: 0, daily: [] }
            });
        }
    }
    next();
});
router.get('/example', exampleController.getExample);
router.use('/auth', auth_routes_1.default);
router.use('/payment', payment_routes_1.default);
router.use('/orders', order_routes_1.default);
router.use('/admin', admin_routes_1.default);
router.use('/products', product_routes_1.default);
router.use('/collections', collection_routes_1.default);
router.use('/products/stocks', stock_routes_1.default);
router.use('/analytics', analytics_routes_1.default);
router.use('/user', user_routes_1.default);
router.use('/coupons', coupon_routes_1.default);
exports.default = router;
