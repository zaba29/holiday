"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leaveService_1 = require("../services/leaveService");
const mailer_1 = require("../email/mailer");
jest.mock('../prisma', () => ({
    leaveRequest: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 1, userId: 1 }),
        update: jest.fn().mockResolvedValue({
            id: 1,
            userId: 1,
            startDate: new Date(),
            endDate: new Date(),
            daysRequested: 2,
            type: 'HOLIDAY',
            user: { email: 'user@example.com', remainingDays: 20, daysTaken: 5 },
        }),
        findMany: jest.fn(),
    },
    user: {
        findUnique: jest.fn().mockResolvedValue({ id: 1, firstName: 'Amy', lastName: 'Lee', remainingDays: 20, daysTaken: 2 }),
        update: jest.fn(),
    },
}));
jest.mock('../email/mailer', () => ({ sendMail: jest.fn() }));
describe('leave service', () => {
    it('creates leave request and emails admin', async () => {
        await (0, leaveService_1.createLeaveRequest)(1, { startDate: '2024-09-01', endDate: '2024-09-02', type: 'HOLIDAY' });
        expect(mailer_1.sendMail).toHaveBeenCalled();
    });
    it('updates leave status and notifies employee', async () => {
        await (0, leaveService_1.changeLeaveStatus)(1, 'APPROVED');
        expect(mailer_1.sendMail).toHaveBeenCalled();
    });
});
