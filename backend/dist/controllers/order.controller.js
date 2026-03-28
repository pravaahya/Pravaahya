"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const invoiceService_1 = require("../services/invoiceService");
class OrderController {
    linkUserToOrder = async (req, res) => {
        try {
            const userId = req.user?.userId;
            const { orderId } = req.body;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const order = await order_model_1.default.findByIdAndUpdate(orderId, { userId }, { new: true });
            res.status(200).json({ success: true, data: order });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    getInvoice = async (req, res) => {
        try {
            const { id } = req.params;
            const order = await order_model_1.default.findById(id);
            if (!order) {
                res.status(404).json({ error: "No historical transaction origin mapped to this precise ID layer." });
                return;
            }
            const pdfBuffer = await (0, invoiceService_1.generateInvoicePDF)(order);
            // Dynamically determine attachment or inline display mapping natively
            const disposition = req.query.download === 'true' ? 'attachment' : 'inline';
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `${disposition}; filename=Pravaahya-Invoice-${order._id}.pdf`);
            res.send(pdfBuffer);
        }
        catch (error) {
            console.error("[Order] Documentation Generation Fault:", error);
            res.status(500).json({ error: "Could not allocate or translate logical parameters into PDF formatting." });
        }
    };
    getOrders = async (req, res) => {
        try {
            const orders = await order_model_1.default.find().sort({ createdAt: -1 });
            res.status(200).json({ success: true, data: orders });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    getOrder = async (req, res) => {
        try {
            const order = await order_model_1.default.findById(req.params.id);
            if (!order) {
                res.status(404).json({ error: "Order block missing from network matrix unconditionally." });
                return;
            }
            res.status(200).json({ success: true, data: order });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    updateOrderStatus = async (req, res) => {
        try {
            const { status, notifyWhatsApp } = req.body;
            const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "PENDING", "PAID", "FAILED", "paid"];
            if (!validStatuses.includes(status)) {
                res.status(400).json({ error: "Invalid status transition structurally intercepted." });
                return;
            }
            const orderToUpdate = await order_model_1.default.findById(req.params.id);
            if (!orderToUpdate) {
                res.status(404).json({ error: "No persistent object mapped to this internal route ID natively." });
                return;
            }
            // Block Paid -> Pending transition organically 
            const oldStatus = orderToUpdate.status?.toLowerCase();
            const newStatus = status.toLowerCase();
            if (oldStatus !== "pending" && oldStatus !== "failed" && newStatus === "pending") {
                res.status(400).json({ error: "Operation Blocked: Ongoing/Paid orders cannot be permanently reverted to pending states." });
                return;
            }
            const order = await order_model_1.default.findByIdAndUpdate(req.params.id, {
                $set: { status },
                $push: { statusHistory: { status, timestamp: new Date() } }
            }, { new: true });
            if (!order) {
                res.status(404).json({ error: "No persistent object mapped to this internal route ID natively." });
                return;
            }
            // Hook conditional user notification dispatch logic natively independent of structural crashes globally
            if (notifyWhatsApp && order.user?.phone) {
                const { sendWhatsAppOrderUpdate } = require('../services/whatsappService');
                await sendWhatsAppOrderUpdate(order.user.phone, order._id.toString(), status);
            }
            // Hook robust SMTP array independently protecting application flow natively
            const { notifyEmail, emailAddress } = req.body;
            const targetMail = emailAddress || order.user?.email || "customer@example.com"; // Extract visually mapped target routing safely simulating missing nodes
            if (notifyEmail && targetMail) {
                const { sendEmail } = require('../services/email.service');
                const { getOrderStatusUpdateEmail } = require('../utils/emailTemplates');
                const mailHtml = getOrderStatusUpdateEmail({
                    orderId: order._id.toString(),
                    amount: order.total || 0,
                    userName: order.user?.name || "Customer",
                    status: status
                });
                await sendEmail(targetMail, `Pravaahya Delivery Log: Update #${order._id.toString()}`, mailHtml);
            }
            res.status(200).json({ success: true, data: order });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}
exports.OrderController = OrderController;
