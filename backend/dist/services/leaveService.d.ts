import { LeaveStatus, LeaveType } from '@prisma/client';
export declare const createLeaveRequest: (userId: number, data: {
    startDate: string;
    endDate: string;
    type: LeaveType;
    comment?: string;
}) => Promise<any>;
export declare const changeLeaveStatus: (leaveId: number, status: LeaveStatus, adminNote?: string) => Promise<any>;
export declare const listLeaveRequests: (params: {
    status?: LeaveStatus;
    userId?: number;
}) => any;
//# sourceMappingURL=leaveService.d.ts.map