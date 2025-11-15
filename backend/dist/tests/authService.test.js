"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = require("../services/authService");
const bcrypt_1 = __importDefault(require("bcrypt"));
jest.mock('../prisma', () => ({
    user: {
        findUnique: jest.fn().mockResolvedValue({
            id: 1,
            email: 'admin@company.test',
            passwordHash: '$2b$10$abcdefghijklmnopqrstuv',
            role: 'ADMIN',
            status: 'ACTIVE',
            firstName: 'Admin',
            lastName: 'User',
        }),
        findFirst: jest.fn(),
        create: jest.fn(),
    },
}));
jest.mock('bcrypt');
describe('authenticateUser', () => {
    it('returns token when credentials valid', async () => {
        bcrypt_1.default.compare.mockResolvedValue(true);
        const result = await (0, authService_1.authenticateUser)('admin@company.test', 'admin');
        expect(result?.token).toBeDefined();
    });
});
