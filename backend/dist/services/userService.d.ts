import { Role, UserStatus } from '@prisma/client';
export declare const listUsers: () => any;
export declare const updateUser: (id: number, data: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    employeeNumber: string;
    annualAllocation: number;
    remainingDays: number;
    status: UserStatus;
    role: Role;
}>) => any;
export declare const getUserWithLeave: (id: number) => any;
//# sourceMappingURL=userService.d.ts.map