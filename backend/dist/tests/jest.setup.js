"use strict";
jest.mock('@prisma/client', () => ({
    Role: { ADMIN: 'ADMIN', EMPLOYEE: 'EMPLOYEE' },
    UserStatus: { PENDING: 'PENDING', ACTIVE: 'ACTIVE', REJECTED: 'REJECTED', DISABLED: 'DISABLED' },
    RegistrationStatus: { PENDING: 'PENDING', APPROVED: 'APPROVED', REJECTED: 'REJECTED', MORE_INFO: 'MORE_INFO' },
    LeaveType: { HOLIDAY: 'HOLIDAY', UNPAID: 'UNPAID', SICK: 'SICK', OTHER: 'OTHER' },
    LeaveStatus: { PENDING: 'PENDING', APPROVED: 'APPROVED', REJECTED: 'REJECTED', MORE_INFO: 'MORE_INFO' },
    PrismaClient: class {
    },
}));
