"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
class UserController {
    getProfile = async (req, res) => {
        try {
            const { userId, phone, email } = req.user;
            let user = null;
            if (userId) {
                user = await user_model_1.default.findById(userId).select('-__v');
            }
            else if (email) {
                user = await user_model_1.default.findOne({ email }).select('-__v');
            }
            else if (phone) {
                user = await user_model_1.default.findOne({ phone }).select('-__v');
            }
            if (!user) {
                if (phone) {
                    res.status(200).json({ success: true, data: { phone, email: '', name: '' } });
                    return;
                }
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    updateProfile = async (req, res) => {
        try {
            const { userId, phone, email } = req.user;
            const { name, phone: newPhone } = req.body;
            let user = null;
            if (userId)
                user = await user_model_1.default.findById(userId);
            else if (email)
                user = await user_model_1.default.findOne({ email });
            else if (phone)
                user = await user_model_1.default.findOne({ phone });
            if (!user) {
                res.status(400).json({ error: 'Legacy profiles cannot be updated directly. Please log out and securely log back in with an Email Identifier.' });
                return;
            }
            user.name = name;
            user.phone = newPhone;
            await user.save();
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    getUserOrders = async (req, res) => {
        try {
            const userId = req.user?.userId;
            const orders = await order_model_1.default.find({ userId }).sort({ createdAt: -1 });
            res.status(200).json({ success: true, data: orders });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}
exports.UserController = UserController;
