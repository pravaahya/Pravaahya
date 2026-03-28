"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const order_model_1 = __importDefault(require("../models/order.model"));
const trackConversion_1 = require("../utils/trackConversion");
class PaymentController {
    getRazorpayInstance() {
        return new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_SECRET || '',
        });
    }
    createOrder = async (req, res) => {
        try {
            const { amount, currency = "INR", user, products } = req.body;
            if (!amount || amount <= 0) {
                res.status(400).json({ error: "Valid amount is required to configure order generation." });
                return;
            }
            const options = {
                amount: Math.round(amount * 100), // Razorpay demands smallest currency integer (paise)
                currency,
                receipt: `receipt_order_${Date.now()}`,
            };
            const razorpay = this.getRazorpayInstance();
            const order = await razorpay.orders.create(options);
            // Inject transaction into runtime database with strict PENDING constraints tracking checkout intent natively.
            await order_model_1.default.create({
                user,
                products,
                total: amount,
                razorpayOrderId: order.id,
                status: "PENDING"
            });
            res.status(200).json({ success: true, order });
        }
        catch (error) {
            console.error("[Razorpay] Order Generation Fault:", error);
            res.status(500).json({ error: "Razorpay Gateway Rejection: " + (error.error?.description || error.message || "Unknown cryptographic fault.") });
        }
    };
    verifyPayment = async (req, res) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                res.status(400).json({ error: "Incomplete payment verification payload map." });
                return;
            }
            // Prevent Frontend trust loop via precise crypto backend comparisons
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto_1.default
                .createHmac('sha256', process.env.RAZORPAY_SECRET || '')
                .update(body.toString())
                .digest('hex');
            if (expectedSignature === razorpay_signature) {
                // Legit. Map into DB enforcing terminal state changes safely blocking unverified inputs.
                const updatedOrder = await order_model_1.default.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: "PAID", paymentId: razorpay_payment_id }, { new: true });
                await (0, trackConversion_1.trackConversion)(); // Record analytical goal completion boundary dynamically
                // SMTP Transaction Baseline Notification hook
                try {
                    const { sendEmail } = require('../services/email.service');
                    const { getOrderConfirmationEmail } = require('../utils/emailTemplates');
                    const { generateInvoicePDF } = require('../services/invoiceService');
                    // Extract context structurally. Standard fallback maps safely simulating independent missing values effectively.
                    const targetEmail = updatedOrder?.user?.email;
                    if (targetEmail) {
                        const mailHtml = getOrderConfirmationEmail({
                            orderId: razorpay_order_id,
                            amount: updatedOrder?.total || 0,
                            userName: updatedOrder?.user?.name || "Valued User",
                            status: "PAID"
                        });
                        const pdfBuffer = await generateInvoicePDF(updatedOrder);
                        await sendEmail(targetEmail, `Pravaahya Tax Invoice & Order Confirmation #${razorpay_order_id}`, mailHtml, [
                            {
                                filename: `Pravaahya-Invoice-${razorpay_order_id}.pdf`,
                                content: pdfBuffer,
                                contentType: 'application/pdf'
                            }
                        ]);
                    }
                }
                catch (e) {
                    console.error("[Payment Sync] SMTP Fault bypass caught gracefully.", e);
                }
                res.status(200).json({ success: true, message: "Payment validated legitimately and mapped effectively.", orderId: updatedOrder?._id });
            }
            else {
                // Forcery detected
                res.status(400).json({ error: "Cryptographic signature verification failed. Untrusted frontend source." });
            }
        }
        catch (error) {
            console.error("[Razorpay] Verification Handling Fault:", error);
            res.status(500).json({ error: "Could not execute secure checkout validation sequence." });
        }
    };
}
exports.PaymentController = PaymentController;
