"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registrationService_1 = require("../services/registrationService");
const mailer_1 = require("../email/mailer");
jest.mock('../prisma', () => ({
    registrationRequest: {
        create: jest.fn().mockResolvedValue({ id: 1 }),
        findUnique: jest.fn().mockResolvedValue({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            employeeNumber: 'E1',
            passwordHash: 'hash',
            status: 'PENDING',
        }),
        update: jest.fn(),
    },
    user: {
        create: jest.fn().mockResolvedValue({ id: 1, email: 'john@example.com' }),
        findFirst: jest.fn(),
    },
}));
jest.mock('../email/mailer', () => ({ sendMail: jest.fn() }));
jest.mock('../services/authService', () => ({ hashPassword: jest.fn().mockResolvedValue('hash') }));
describe('registration service', () => {
    it('creates a registration and notifies admin', async () => {
        await (0, registrationService_1.createRegistration)({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', employeeNumber: 'E1', password: 'Secret123!' });
        expect(mailer_1.sendMail).toHaveBeenCalled();
    });
    it('approves registration and creates user', async () => {
        const user = await (0, registrationService_1.approveRegistration)('token');
        expect(user).toBeTruthy();
    });
});
