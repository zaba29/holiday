"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialAdmin = exports.hashPassword = exports.authenticateUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const env_1 = require("../config/env");
const client_1 = require("@prisma/client");
const authenticateUser = async (email, password) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        return null;
    }
    const valid = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!valid || user.status !== client_1.UserStatus.ACTIVE) {
        return null;
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, env_1.config.jwtSecret, { expiresIn: '12h' });
    return { user, token };
};
exports.authenticateUser = authenticateUser;
const hashPassword = (password) => bcrypt_1.default.hash(password, 10);
exports.hashPassword = hashPassword;
const createInitialAdmin = async () => {
    const existing = await prisma_1.default.user.findFirst({ where: { role: client_1.Role.ADMIN } });
    if (existing)
        return existing;
    const passwordHash = await (0, exports.hashPassword)('admin');
    const admin = await prisma_1.default.user.create({
        data: {
            firstName: 'Initial',
            lastName: 'Admin',
            email: 'admin@company.test',
            employeeNumber: 'ADMIN-001',
            passwordHash,
            role: client_1.Role.ADMIN,
            status: client_1.UserStatus.ACTIVE,
            annualAllocation: env_1.config.defaultAnnualAllocation,
            remainingDays: env_1.config.defaultAnnualAllocation,
        },
    });
    return admin;
};
exports.createInitialAdmin = createInitialAdmin;
