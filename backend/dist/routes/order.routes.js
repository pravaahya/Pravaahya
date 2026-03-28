"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const orderController = new order_controller_1.OrderController();
// Target admin logic strictly isolating operational limits onto secured HTTP routes seamlessly
router.get('/', auth_middleware_1.protect, auth_middleware_1.adminOnly, orderController.getOrders);
router.get('/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, orderController.getOrder);
router.put('/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, orderController.updateOrderStatus);
// Map dynamic URL structure effectively enforcing transaction bounds natively
router.get('/:id/invoice', orderController.getInvoice);
exports.default = router;
