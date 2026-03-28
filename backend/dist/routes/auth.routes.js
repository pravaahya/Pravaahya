"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Map POST operations natively for login authentication workflows
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/admin-login', authController.adminLogin);
exports.default = router;
