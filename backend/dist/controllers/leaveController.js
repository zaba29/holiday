"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdate = exports.adminList = exports.listMine = exports.createLeave = void 0;
const leaveService_1 = require("../services/leaveService");
const createLeave = async (req, res) => {
    const leave = await (0, leaveService_1.createLeaveRequest)(req.user.id, req.body);
    res.status(201).json(leave);
};
exports.createLeave = createLeave;
const listMine = async (req, res) => {
    const leaves = await (0, leaveService_1.listLeaveRequests)({ userId: req.user.id });
    res.json(leaves);
};
exports.listMine = listMine;
const adminList = async (req, res) => {
    const { status, userId } = req.query;
    const leaves = await (0, leaveService_1.listLeaveRequests)({
        status: status ? status : undefined,
        userId: userId ? parseInt(userId, 10) : undefined,
    });
    res.json(leaves);
};
exports.adminList = adminList;
const adminUpdate = async (req, res) => {
    const leave = await (0, leaveService_1.changeLeaveStatus)(parseInt(req.params.id, 10), req.body.status, req.body.note);
    res.json(leave);
};
exports.adminUpdate = adminUpdate;
