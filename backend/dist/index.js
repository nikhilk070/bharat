"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const startupRoutes_1 = __importDefault(require("./routes/startupRoutes"));
const acceleratorRoutes_1 = __importDefault(require("./routes/acceleratorRoutes"));
const vivachanaRoutes_1 = __importDefault(require("./routes/vivachanaRoutes"));
const investorRoutes_1 = __importDefault(require("./routes/investorRoutes"));
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/startups', startupRoutes_1.default);
app.use('/api/accelerator', acceleratorRoutes_1.default);
app.use('/api/vivachana', vivachanaRoutes_1.default);
app.use('/api/investors', investorRoutes_1.default);
// Basic Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Bharat Ventures API is running.' });
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
