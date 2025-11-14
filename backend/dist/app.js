"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csurf_1 = __importDefault(require("csurf"));
const env_1 = require("./config/env");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const registrationRoutes_1 = __importDefault(require("./routes/registrationRoutes"));
const leaveRoutes_1 = __importDefault(require("./routes/leaveRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const systemRoutes_1 = __importDefault(require("./routes/systemRoutes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.config.appUrl, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
if (process.env.NODE_ENV !== 'test') {
    app.use((0, csurf_1.default)({ cookie: true }));
}
app.use('/api/auth', authRoutes_1.default);
app.use('/api/registrations', registrationRoutes_1.default);
app.use('/api/leaves', leaveRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/system', systemRoutes_1.default);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
exports.default = app;
