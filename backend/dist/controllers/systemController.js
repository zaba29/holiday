"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFirstAdmin = exports.updateSettingsController = exports.adminSettings = exports.publicStatus = void 0;
const systemService_1 = require("../services/systemService");
const authService_1 = require("../services/authService");
const publicStatus = async (_req, res) => {
    const state = await (0, systemService_1.getPublicSystemState)();
    res.json(state);
};
exports.publicStatus = publicStatus;
const adminSettings = async (_req, res) => {
    const settings = await (0, systemService_1.getSystemSettings)();
    const state = await (0, systemService_1.getPublicSystemState)();
    res.json({
        settings,
        hasUsers: state.hasUsers,
    });
};
exports.adminSettings = adminSettings;
const updateSettingsController = async (req, res) => {
    try {
        const payload = {};
        if (typeof req.body.allowSelfRegistration === 'boolean') {
            payload.allowSelfRegistration = req.body.allowSelfRegistration;
        }
        if (req.body.authMode) {
            payload.authMode = req.body.authMode;
        }
        const updated = await (0, systemService_1.updateSystemSettings)(payload);
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateSettingsController = updateSettingsController;
const createFirstAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, employeeNumber, password } = req.body;
        if (!firstName || !lastName || !email || !employeeNumber || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        await (0, systemService_1.createInitialAdminAccount)({ firstName, lastName, email, employeeNumber, password });
        const loginResult = await (0, authService_1.authenticateUser)(email, password);
        return res.status(201).json(loginResult);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.createFirstAdmin = createFirstAdmin;
