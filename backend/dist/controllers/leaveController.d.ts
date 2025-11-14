import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createLeave: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listMine: (req: AuthRequest, res: Response) => Promise<void>;
export declare const adminList: (req: Request, res: Response) => Promise<void>;
export declare const adminUpdate: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=leaveController.d.ts.map