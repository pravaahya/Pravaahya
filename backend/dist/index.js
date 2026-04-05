"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const trackVisit_middleware_1 = require("./middleware/trackVisit.middleware");
const index_1 = __importDefault(require("./routes/index"));
const db_1 = require("./config/db");
const stockAlertJob_1 = require("./cron/stockAlertJob");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false })); // Permitting cross-origin fetching for public image directory dynamically
app.use((0, cors_1.default)({
    origin: [
        'https://pravaahya.com',
        'https://www.pravaahya.com',
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(express_1.default.json());
// Serve static dynamic product imagery structurally tracking local disks
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
app.use('/api', async (req, res, next) => {
    try {
        await (0, db_1.connectDB)();
    }
    catch (err) {
        console.error("Database connection failure prior to route access:", err);
    }
    next();
}, trackVisit_middleware_1.trackVisit, index_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});
app.get('/admin', (req, res) => {
    // If the user attempts reaching the API's port for the UI interface natively
    res.redirect('http://localhost:3000/admin/login');
});
if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        console.log(`Server successfully secured and running dynamically on native port ${PORT}`);
        // Formulate independent automated Cron jobs executing entirely decoupled from router proxy
        (0, stockAlertJob_1.startStockAlertCron)();
    });
}
(0, db_1.connectDB)().catch((err) => {
    console.error("FATAL: MongoDB connection rejected organically.", err);
});
// Vercel Serverless Function Export Hook
module.exports = app;
exports.default = app;
