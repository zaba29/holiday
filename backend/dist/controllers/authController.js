"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = void 0;
const authService_1 = require("../services/authService");
const prisma_1 = __importDefault(require("../prisma"));
const systemService_1 = require("../services/systemService");
const login = async (req, res) => {
    const { email, password } = req.body;
    const state = await (0, systemService_1.getPublicSystemState)();
    if (!state.hasUsers) {
        return res.status(400).json({ message: 'Initial setup required' });
    }
    const result = await (0, authService_1.authenticateUser)(email, password);
    if (!result) {
        return res.status(401).json({ message: 'Invalid credentials or inactive account' });
    }
    return res.json({ token: result.token, user: { id: result.user.id, role: result.user.role, firstName: result.user.firstName, lastName: result.user.lastName } });
};
exports.login = login;
const me = async (req, res) => {
    const userId = req.user.id;
    const user = await prisma_1.default.user.findUnique({ where: { id: userId }, include: { leaveRequests: true } });
    return res.json(user);
};
exports.me = me;
