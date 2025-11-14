import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { hashPassword } from '../src/services/authService';
import { config } from '../src/config/env';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
  if (!adminExists) {
    const passwordHash = await hashPassword('admin');
    await prisma.user.create({
      data: {
        firstName: 'Initial',
        lastName: 'Admin',
        email: 'admin@company.test',
        employeeNumber: 'ADMIN-001',
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        passwordHash,
        annualAllocation: config.defaultAnnualAllocation,
        remainingDays: config.defaultAnnualAllocation,
      },
    });
    console.log('Seeded default admin user (change credentials in production).');
  } else {
    console.log('Admin already exists, skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
