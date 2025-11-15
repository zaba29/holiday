"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWithLeave = exports.updateUser = exports.listUsers = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const listUsers = () => prisma_1.default.user.findMany({ orderBy: { lastName: 'asc' }, select: { id: true, firstName: true, lastName: true, email: true, employeeNumber: true, role: true, status: true, annualAllocation: true, remainingDays: true } });
exports.listUsers = listUsers;
const updateUser = (id, data) => prisma_1.default.user.update({ where: { id }, data });
exports.updateUser = updateUser;
const getUserWithLeave = (id) => prisma_1.default.user.findUnique({ where: { id }, include: { leaveRequests: true } });
exports.getUserWithLeave = getUserWithLeave;
