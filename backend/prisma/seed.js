"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const authService_1 = require("../src/services/authService");
const env_1 = require("../src/config/env");
const prisma = new client_1.PrismaClient();
const DEV_ADMIN_EMAIL = 'admin@company.test';
const DEV_ADMIN_PASSWORD = 'admin';
async function main() {
    await prisma.systemSetting.upsert({
        where: { id: 1 },
        update: { allowSelfRegistration: true },
        create: { allowSelfRegistration: true },
    });
    const adminExists = await prisma.user.findUnique({ where: { email: DEV_ADMIN_EMAIL } });
    if (!adminExists) {
        const passwordHash = await (0, authService_1.hashPassword)(DEV_ADMIN_PASSWORD);
        const allocation = env_1.config.defaultAnnualAllocation;
        await prisma.user.create({
            data: {
                firstName: 'System',
                lastName: 'Admin',
                email: DEV_ADMIN_EMAIL,
                employeeNumber: 'ADMIN-001',
                passwordHash,
                role: client_1.Role.ADMIN,
                status: client_1.UserStatus.ACTIVE,
                annualAllocation: allocation,
                remainingDays: allocation,
            },
        });
        console.log('Seeded development admin user admin@company.test / admin. Change immediately in production.');
    }
    else {
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
//# sourceMappingURL=seed.js.map
