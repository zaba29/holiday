import { approveRegistration, createRegistration } from '../services/registrationService';
import prisma from '../prisma';
import { sendMail } from '../email/mailer';
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
    await createRegistration({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', employeeNumber: 'E1', password: 'Secret123!' });
    expect(sendMail).toHaveBeenCalled();
  });

  it('approves registration and creates user', async () => {
    const user = await approveRegistration('token');
    expect(user).toBeTruthy();
  });
});
