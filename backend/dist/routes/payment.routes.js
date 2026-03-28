"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const router = (0, express_1.Router)();
const paymentController = new payment_controller_1.PaymentController();
const validateGuestCheckout_1 = require("../middleware/validateGuestCheckout");
// Map secure payment gateways natively 
router.post('/create-order', validateGuestCheckout_1.validateGuestCheckout, paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);
exports.default = router;
