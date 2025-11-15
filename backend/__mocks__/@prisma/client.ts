export const Role = { ADMIN: 'ADMIN', EMPLOYEE: 'EMPLOYEE' } as const;
export const UserStatus = { PENDING: 'PENDING', ACTIVE: 'ACTIVE', REJECTED: 'REJECTED', DISABLED: 'DISABLED' } as const;
export const RegistrationStatus = { PENDING: 'PENDING', APPROVED: 'APPROVED', REJECTED: 'REJECTED', MORE_INFO: 'MORE_INFO' } as const;
export const LeaveType = { HOLIDAY: 'HOLIDAY', UNPAID: 'UNPAID', SICK: 'SICK', OTHER: 'OTHER' } as const;
export const LeaveStatus = { PENDING: 'PENDING', APPROVED: 'APPROVED', REJECTED: 'REJECTED', MORE_INFO: 'MORE_INFO' } as const;
export class PrismaClient {}
