"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.authenticateUser = void 0;
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
