"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRegistrationEnabled = exports.createInitialAdminAccount = exports.updateSystemSettings = exports.getPublicSystemState = exports.getSystemSettings = exports.ensureSystemSettings = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const client_1 = require("@prisma/client");
const authService_1 = require("./authService");
const env_1 = require("../config/env");
const ensureSystemSettings = async () => {
    const existing = await prisma_1.default.systemSetting.findFirst();
    if (existing)
        return existing;
    return prisma_1.default.systemSetting.create({ data: { allowSelfRegistration: true } });
};
exports.ensureSystemSettings = ensureSystemSettings;
const getSystemSettings = async () => (0, exports.ensureSystemSettings)();
exports.getSystemSettings = getSystemSettings;
const getPublicSystemState = async () => {
    const settings = await (0, exports.ensureSystemSettings)();
    const userCount = await prisma_1.default.user.count();
    const hasUsers = userCount > 0;
    const effectiveAuthMode = hasUsers ? client_1.AuthMode.PASSWORD_ONLY : settings.authMode;
    return {
        allowSelfRegistration: settings.allowSelfRegistration,
        authMode: effectiveAuthMode,
        hasUsers,
        setupRequired: !hasUsers,
    };
};
exports.getPublicSystemState = getPublicSystemState;
const updateSystemSettings = async (data) => {
    const settings = await (0, exports.ensureSystemSettings)();
    const userCount = await prisma_1.default.user.count();
    const hasUsers = userCount > 0;
    if (data.authMode === client_1.AuthMode.OPEN_WHEN_EMPTY && hasUsers) {
        throw new Error('Authentication mode cannot revert once setup is complete');
    }
    const updateData = {};
    if (typeof data.allowSelfRegistration === 'boolean') {
        updateData.allowSelfRegistration = data.allowSelfRegistration;
    }
    if (data.authMode && data.authMode !== settings.authMode) {
        updateData.authMode = data.authMode;
    }
    const updated = await prisma_1.default.systemSetting.update({ where: { id: settings.id }, data: updateData });
    return { ...updated, hasUsers };
};
exports.updateSystemSettings = updateSystemSettings;
const createInitialAdminAccount = async (payload) => {
    const userCount = await prisma_1.default.user.count();
    if (userCount > 0) {
        throw new Error('Setup already completed');
    }
    const passwordHash = await (0, authService_1.hashPassword)(payload.password);
    const annualAllocation = env_1.config.defaultAnnualAllocation;
    const user = await prisma_1.default.user.create({
        data: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            employeeNumber: payload.employeeNumber,
            passwordHash,
            role: client_1.Role.ADMIN,
            status: client_1.UserStatus.ACTIVE,
            annualAllocation,
            remainingDays: annualAllocation,
        },
    });
    const settings = await (0, exports.ensureSystemSettings)();
    await prisma_1.default.systemSetting.update({
        where: { id: settings.id },
        data: { authMode: client_1.AuthMode.PASSWORD_ONLY },
    });
    return user;
};
exports.createInitialAdminAccount = createInitialAdminAccount;
const isRegistrationEnabled = async () => {
    const settings = await (0, exports.ensureSystemSettings)();
    return settings.allowSelfRegistration;
};
exports.isRegistrationEnabled = isRegistrationEnabled;
