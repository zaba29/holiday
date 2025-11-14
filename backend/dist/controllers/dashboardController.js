"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDashboard = exports.employeeDashboard = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const client_1 = require("@prisma/client");
const employeeDashboard = async (req, res) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: req.user.id },
        include: {
            leaveRequests: {
                where: { status: { in: [client_1.LeaveStatus.APPROVED, client_1.LeaveStatus.PENDING] } },
                orderBy: { startDate: 'asc' },
            },
        },
    });
    res.json({
        allocation: user?.annualAllocation,
        taken: user?.daysTaken,
        remaining: user?.remainingDays,
        upcoming: user?.leaveRequests?.filter((l) => l.status === client_1.LeaveStatus.APPROVED && l.startDate > new Date()).slice(0, 5),
        pending: user?.leaveRequests?.filter((l) => l.status === client_1.LeaveStatus.PENDING),
    });
};
exports.employeeDashboard = employeeDashboard;
const adminDashboard = async (_req, res) => {
    const pendingRegistrations = await prisma_1.default.registrationRequest.count({ where: { status: 'PENDING' } });
    const pendingLeaves = await prisma_1.default.leaveRequest.count({ where: { status: client_1.LeaveStatus.PENDING } });
    const employees = await prisma_1.default.user.count({ where: { role: client_1.Role.EMPLOYEE, status: client_1.UserStatus.ACTIVE } });
    const upcoming = await prisma_1.default.leaveRequest.findMany({
        where: { status: client_1.LeaveStatus.APPROVED, startDate: { gte: new Date() } },
        include: { user: true },
        take: 5,
        orderBy: { startDate: 'asc' },
    });
    res.json({ pendingRegistrations, pendingLeaves, employees, upcoming });
};
exports.adminDashboard = adminDashboard;
