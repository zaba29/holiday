import { authenticateUser } from '../services/authService';
import prisma from '../prisma';
import bcrypt from 'bcrypt';

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
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await authenticateUser('admin@company.test', 'admin');
    expect(result?.token).toBeDefined();
  });
});
