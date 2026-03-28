"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otp_model_1 = __importDefault(require("../models/otp.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const whatsappService_1 = require("../services/whatsappService");
const email_service_1 = require("../services/email.service");
const trackConversion_1 = require("../utils/trackConversion");
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_pravaahya_key_2026';
class AuthController {
    sendOtp = async (req, res) => {
        try {
            const { phone, email } = req.body;
            if (!phone && !email) {
                res.status(400).json({ error: "Phone or Email required." });
                return;
            }
            if (phone && !/^\d{10}$/.test(phone)) {
                res.status(400).json({ error: "Invalid phone number block constraints." });
                return;
            }
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                res.status(400).json({ error: "Invalid email format." });
                return;
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const salt = await bcryptjs_1.default.genSalt(10);
            const otpHash = await bcryptjs_1.default.hash(otp, salt);
            const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes TTL
            console.log(`\n======================================================`);
            console.log(`[DEV MODE] OTP generated for ${email || phone}: ${otp}`);
            console.log(`======================================================\n`);
            if (email) {
                await otp_model_1.default.deleteMany({ email });
                await otp_model_1.default.create({ email, otpHash, expiresAt });
                await (0, email_service_1.sendEmail)(email, "Your Login OTP", `<h3>Your secure Pravaahya OTP code is: <strong>${otp}</strong></h3><p>This code will naturally expire in exactly 5 minutes.</p>`);
            }
            else if (phone) {
                await otp_model_1.default.deleteMany({ phone });
                await otp_model_1.default.create({ phone, otpHash, expiresAt });
                await (0, whatsappService_1.sendWhatsAppOtp)(phone, otp);
            }
            res.status(200).json({ message: "OTP verification sequence initiated and locked." });
        }
        catch (error) {
            console.error("[Auth] Dispatch Failure:", error?.message);
            res.status(500).json({ error: "Internal Auth Node Gateway Error" });
        }
    };
    verifyOtp = async (req, res) => {
        try {
            const { phone, email, otp } = req.body;
            if ((!phone && !email) || !otp) {
                res.status(400).json({ error: "Incomplete authentication payload map." });
                return;
            }
            const query = email ? { email } : { phone };
            const otpRecord = await otp_model_1.default.findOne(query);
            if (!otpRecord) {
                res.status(400).json({ error: "Security Exception: Code intrinsically expired or invalid origin." });
                return;
            }
            if (otpRecord.attempts >= 5) {
                await otp_model_1.default.deleteOne({ _id: otpRecord._id });
                res.status(400).json({ error: "Maximum attempts exceeded. Request a new OTP." });
                return;
            }
            const isValid = await bcryptjs_1.default.compare(otp, otpRecord.otpHash);
            if (!isValid) {
                otpRecord.attempts += 1;
                await otpRecord.save();
                res.status(400).json({ error: "Invalid OTP Token mapped." });
                return;
            }
            await otp_model_1.default.deleteOne({ _id: otpRecord._id });
            let tokenPayload = {};
            let role = 'user';
            if (email) {
                let user = await user_model_1.default.findOne({ email });
                if (!user) {
                    user = await user_model_1.default.create({ email, isVerified: true });
                }
                else if (!user.isVerified) {
                    user.isVerified = true;
                    await user.save();
                }
                tokenPayload = { userId: user._id, email: user.email, role: 'user' };
            }
            else {
                const adminPhones = (process.env.ADMIN_PHONES || "").split(",");
                role = adminPhones.includes(phone) ? 'admin' : 'user';
                tokenPayload = { phone, role };
            }
            const token = jsonwebtoken_1.default.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });
            if (role === 'user')
                await (0, trackConversion_1.trackConversion)();
            res.status(200).json({ message: "Identity securely authenticated.", token });
        }
        catch (error) {
            console.error("[Auth] Verification Error:", error?.message);
            res.status(500).json({ error: "Internal Verification Node Error" });
        }
    };
    adminLogin = async (req, res) => {
        try {
            const { username, password } = req.body;
            const validUser = process.env.ADMIN_USERNAME || "boss";
            const validPass = process.env.ADMIN_PASSWORD || "strongpassword123";
            if (!username || !password) {
                res.status(400).json({ error: "Missing credential data blocks natively." });
                return;
            }
            if (username === validUser && password === validPass) {
                // Force inject strict 'admin' role mathematical properties to bypass auth middleware properly
                const token = jsonwebtoken_1.default.sign({ username, role: 'admin' }, process.env.JWT_SECRET || 'super_secret_pravaahya_key_2026', { expiresIn: '1d' });
                res.status(200).json({ success: true, token, message: "Administrative node clearance strictly authorized." });
            }
            else {
                res.status(401).json({ error: "Invalid administrative authentication signature." });
            }
        }
        catch (err) {
            res.status(500).json({ error: "Internal Gateway Encryption Block Error" });
        }
    };
}
exports.AuthController = AuthController;
