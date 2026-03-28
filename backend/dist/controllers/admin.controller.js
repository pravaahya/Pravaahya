"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
class AdminController {
    getUsers = async (req, res) => {
        try {
            // Fetch all users and use aggregation to count their orders securely
            const users = await user_model_1.default.find().select('-__v').sort({ createdAt: -1 });
            const usersWithOrderCount = await Promise.all(users.map(async (user) => {
                const count = await order_model_1.default.countDocuments({ userId: user._id });
                return { ...user.toObject(), totalOrders: count };
            }));
            res.status(200).json({ success: true, data: usersWithOrderCount });
        }
        catch (error) {
            res.status(500).json({ error: "Internal Gateway Encryption Block Error" });
        }
    };
    getUserDetails = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await user_model_1.default.findById(id).select('-__v');
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            const orders = await order_model_1.default.find({ userId: id }).sort({ createdAt: -1 });
            res.status(200).json({ success: true, data: { user, orders } });
        }
        catch (error) {
            res.status(500).json({ error: "Internal Gateway Encryption Block Error" });
        }
    };
}
exports.AdminController = AdminController;
