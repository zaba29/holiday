"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
    jwtSecret: process.env.JWT_SECRET || 'change-me',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@company.test',
    smtp: {
        host: process.env.SMTP_HOST || 'localhost',
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 1025,
        user: process.env.SMTP_USER || '',
        password: process.env.SMTP_PASSWORD || '',
    },
    appUrl: process.env.APP_URL || 'http://localhost:4173',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:4000',
    defaultAnnualAllocation: process.env.DEFAULT_ANNUAL_ALLOCATION
        ? parseInt(process.env.DEFAULT_ANNUAL_ALLOCATION, 10)
        : 28,
};
