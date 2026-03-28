"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coupon_controller_1 = require("../controllers/coupon.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const couponController = new coupon_controller_1.CouponController();
// Publicly active resolution hooks tracking live checkout queries
router.get('/featured', couponController.getFeaturedCoupon);
router.post('/validate', couponController.validateCoupon);
// Secured Administrative Management Network
router.use(auth_middleware_1.protect, auth_middleware_1.adminOnly);
router.post('/', couponController.createCoupon);
router.get('/', couponController.getCoupons);
router.put('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);
exports.default = router;
