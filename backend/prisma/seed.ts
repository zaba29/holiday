import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { hashPassword } from '../src/services/authService';
import { config } from '../src/config/env';

const prisma = new PrismaClient();

const DEV_ADMIN_EMAIL = 'admin@work.flow';
const DEV_ADMIN_PASSWORD = 'admin';

async function main() {
  await prisma.systemSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  });

  const adminExists = await prisma.user.findUnique({ where: { email: DEV_ADMIN_EMAIL } });
  if (!adminExists) {
    const passwordHash = await hashPassword(DEV_ADMIN_PASSWORD);
    const allocation = config.defaultAnnualAllocation;
    await prisma.user.create({
      data: {
        firstName: 'System',
        lastName: 'Admin',
        email: DEV_ADMIN_EMAIL,
        employeeNumber: 'ADMIN-001',
        passwordHash,
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        annualAllocation: allocation,
        remainingDays: allocation,
      },
    });
    console.log('Seeded development admin user admin@work.flow / admin. Change immediately in production.');
  } else {
    console.log('Admin user already present, skipping creation.');
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
