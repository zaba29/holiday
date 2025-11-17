import prisma from '../prisma';
import { AuthMode, Role, UserStatus } from '@prisma/client';
import { hashPassword } from './authService';
import { config } from '../config/env';

export const ensureSystemSettings = async () => {
  const existing = await prisma.systemSetting.findFirst();
  if (existing) return existing;
  return prisma.systemSetting.create({ data: { allowSelfRegistration: true } });
};

export const getSystemSettings = async () => ensureSystemSettings();

export const getPublicSystemState = async () => {
  const settings = await ensureSystemSettings();
  const userCount = await prisma.user.count();
  const hasUsers = userCount > 0;
  const effectiveAuthMode = hasUsers ? AuthMode.PASSWORD_ONLY : settings.authMode;
  return {
    allowSelfRegistration: settings.allowSelfRegistration,
    authMode: effectiveAuthMode,
    hasUsers,
    setupRequired: !hasUsers,
  };
};

export const updateSystemSettings = async (data: { allowSelfRegistration?: boolean; authMode?: AuthMode }) => {
  const settings = await ensureSystemSettings();
  const userCount = await prisma.user.count();
  const hasUsers = userCount > 0;
  if (data.authMode === AuthMode.OPEN_WHEN_EMPTY && hasUsers) {
    throw new Error('Authentication mode cannot revert once setup is complete');
  }
  const updateData: { allowSelfRegistration?: boolean; authMode?: AuthMode } = {};
  if (typeof data.allowSelfRegistration === 'boolean') {
    updateData.allowSelfRegistration = data.allowSelfRegistration;
  }
  if (data.authMode && data.authMode !== settings.authMode) {
    updateData.authMode = data.authMode;
  }
  const updated = await prisma.systemSetting.update({ where: { id: settings.id }, data: updateData });
  return { ...updated, hasUsers };
};

export const createInitialAdminAccount = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  employeeNumber: string;
  password: string;
}) => {
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    throw new Error('Setup already completed');
  }
  const passwordHash = await hashPassword(payload.password);
  const annualAllocation = config.defaultAnnualAllocation;
  const user = await prisma.user.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      employeeNumber: payload.employeeNumber,
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      annualAllocation,
      remainingDays: annualAllocation,
    },
  });
  const settings = await ensureSystemSettings();
  await prisma.systemSetting.update({
    where: { id: settings.id },
    data: { authMode: AuthMode.PASSWORD_ONLY },
  });
  return user;
};

export const isRegistrationEnabled = async () => {
  const settings = await ensureSystemSettings();
  return settings.allowSelfRegistration;
};
