"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponController = void 0;
const coupon_model_1 = __importDefault(require("../models/coupon.model"));
class CouponController {
    createCoupon = async (req, res) => {
        try {
            const { code, discountPercentage, isActive = true, isFeatured = false } = req.body;
            if (!code || isNaN(discountPercentage)) {
                res.status(400).json({ error: "Validation Error: Coupon code and mathematical baseline deduction implicitly required." });
                return;
            }
            const parsedDiscount = Number(discountPercentage);
            if (parsedDiscount < 1 || parsedDiscount > 100) {
                res.status(400).json({ error: "Validation Error: Discount index strictly bounded between 1 and 100." });
                return;
            }
            // Intercept and demote previously assigned featured banners logically enforcing singular active banners
            if (isFeatured === 'true' || isFeatured === true) {
                await coupon_model_1.default.updateMany({ isFeatured: true }, { isFeatured: false });
            }
            const coupon = await coupon_model_1.default.create({
                code: String(code).toUpperCase().trim(),
                discountPercentage: parsedDiscount,
                isActive: isActive === 'true' || isActive === true,
                isFeatured: isFeatured === 'true' || isFeatured === true
            });
            res.status(201).json({ success: true, data: coupon });
        }
        catch (err) {
            if (err.code === 11000) {
                res.status(400).json({ error: "Validation Fault: Identical coupon code already registered against structural node." });
            }
            else {
                res.status(500).json({ error: err.message });
            }
        }
    };
    getCoupons = async (req, res) => {
        try {
            const coupons = await coupon_model_1.default.find().sort({ createdAt: -1 });
            res.status(200).json({ success: true, data: coupons });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    updateCoupon = async (req, res) => {
        try {
            const { code, discountPercentage, isActive, isFeatured } = req.body;
            const updateData = {};
            if (code !== undefined)
                updateData.code = String(code).toUpperCase().trim();
            if (discountPercentage !== undefined) {
                const parsedDiscount = Number(discountPercentage);
                if (parsedDiscount < 1 || parsedDiscount > 100) {
                    res.status(400).json({ error: "Validation Error: Discount index strictly bounded between 1 and 100." });
                    return;
                }
                updateData.discountPercentage = parsedDiscount;
            }
            if (isActive !== undefined)
                updateData.isActive = isActive === 'true' || isActive === true;
            let newIsFeatured = undefined;
            if (isFeatured !== undefined) {
                newIsFeatured = isFeatured === 'true' || isFeatured === true;
                updateData.isFeatured = newIsFeatured;
            }
            // Prevent simultaneous featured anomalies gracefully during active iterations
            if (newIsFeatured === true) {
                await coupon_model_1.default.updateMany({ _id: { $ne: req.params.id }, isFeatured: true }, { isFeatured: false });
            }
            const coupon = await coupon_model_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
            if (!coupon) {
                res.status(404).json({ error: "Data Object logically unreachable from parameter payload." });
                return;
            }
            res.status(200).json({ success: true, data: coupon });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    deleteCoupon = async (req, res) => {
        try {
            const coupon = await coupon_model_1.default.findByIdAndDelete(req.params.id);
            if (!coupon) {
                res.status(404).json({ error: "Logical node missing internally." });
                return;
            }
            res.status(200).json({ success: true, message: "Asset definitively obliterated from logical matrix." });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    // Public Endpoint cleanly interpolating frontend header banners implicitly
    getFeaturedCoupon = async (req, res) => {
        try {
            const coupon = await coupon_model_1.default.findOne({ isFeatured: true, isActive: true });
            // We intentionally do not throw 404 if no banner is defined natively; simply return null to unmount it cleanly.
            res.status(200).json({ success: true, data: coupon });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    // Public Endpoint gracefully authenticating structural cart logic
    validateCoupon = async (req, res) => {
        try {
            const { code } = req.body;
            if (!code) {
                res.status(400).json({ error: "Empty payload natively intercepted." });
                return;
            }
            const coupon = await coupon_model_1.default.findOne({ code: String(code).toUpperCase().trim() });
            if (!coupon) {
                res.status(404).json({ error: "Coupon sequence invalid or systematically unrecognized." });
                return;
            }
            if (!coupon.isActive) {
                res.status(400).json({ error: "Coupon array currently paused or permanently decommissioned." });
                return;
            }
            res.status(200).json({ success: true, discountPercentage: coupon.discountPercentage });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}
exports.CouponController = CouponController;
