"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const order_model_1 = __importDefault(require("../models/order.model"));
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
const adminController = new admin_controller_1.AdminController();
router.get('/users', auth_middleware_1.protect, auth_middleware_1.adminOnly, adminController.getUsers);
router.get('/users/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, adminController.getUserDetails);
// Global router interceptor for offline resilience bridging database authentication constraints.
// Route protected by both middlewares serving analytical arrays dynamically
router.get('/insights', auth_middleware_1.protect, auth_middleware_1.adminOnly, async (req, res) => {
    try {
        const orders = await order_model_1.default.find();
        let totalRevenue = 0;
        const monthlyOrders = new Array(12).fill(0);
        const monthlyRevenue = new Array(12).fill(0);
        orders.forEach(order => {
            const status = order.status?.toUpperCase() || '';
            if (status !== 'PENDING' && status !== 'CANCELLED' && status !== 'FAILED') {
                totalRevenue += (order.total || 0);
            }
            // Log volumes regardless of payment status to predict intent correctly
            if (order.createdAt) {
                const month = new Date(order.createdAt).getMonth();
                monthlyOrders[month] += 1;
                if (status !== 'PENDING' && status !== 'CANCELLED' && status !== 'FAILED') {
                    monthlyRevenue[month] += (order.total || 0);
                }
            }
        });
        res.status(200).json({
            success: true,
            data: {
                totalOrders: orders.length,
                totalRevenue,
                totalUsers: await Promise.resolve().then(() => __importStar(require('../models/user.model'))).then(m => m.default.countDocuments()),
                monthlyOrders,
                monthlyRevenue
            }
        });
    }
    catch (error) {
        console.error("INSIGHTS CRASH:", error);
        res.status(500).json({ success: false, error: "Hardware aggregation constraint failure.", trace: error?.message || String(error) });
    }
});
exports.default = router;
