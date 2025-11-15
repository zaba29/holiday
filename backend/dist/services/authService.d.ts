export declare const authenticateUser: (email: string, password: string) => Promise<{
    user: any;
    token: string;
} | null>;
export declare const hashPassword: (password: string) => Promise<string>;
export declare const createInitialAdmin: () => Promise<any>;
//# sourceMappingURL=authService.d.ts.map