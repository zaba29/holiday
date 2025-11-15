import { Request, Response } from 'express';
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const showRegistration: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const approve: (req: Request, res: Response) => Promise<void>;
export declare const reject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const askInfo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const respondInfo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=registrationController.d.ts.map