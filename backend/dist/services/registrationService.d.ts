export declare const createRegistration: (data: {
    firstName: string;
    lastName: string;
    email: string;
    employeeNumber: string;
    password: string;
}) => Promise<any>;
export declare const getRegistrationByToken: (token: string) => any;
export declare const approveRegistration: (token: string, allocation?: number) => Promise<any>;
export declare const rejectRegistration: (token: string, reason: string) => Promise<any>;
export declare const requestMoreInfo: (token: string, message: string) => Promise<any>;
export declare const respondMoreInfo: (token: string, body: string) => Promise<void>;
//# sourceMappingURL=registrationService.d.ts.map