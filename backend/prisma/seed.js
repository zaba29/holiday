"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const authService_1 = require("../src/services/authService");
const env_1 = require("../src/config/env");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminExists = await prisma.user.findFirst({ where: { role: client_1.Role.ADMIN } });
    if (!adminExists) {
        const passwordHash = await (0, authService_1.hashPassword)('admin');
        await prisma.user.create({
            data: {
                firstName: 'Initial',
                lastName: 'Admin',
                email: 'admin@company.test',
                employeeNumber: 'ADMIN-001',
                role: client_1.Role.ADMIN,
                status: client_1.UserStatus.ACTIVE,
                passwordHash,
                annualAllocation: env_1.config.defaultAnnualAllocation,
                remainingDays: env_1.config.defaultAnnualAllocation,
            },
        });
        console.log('Seeded default admin user (change credentials in production).');
    }
    else {
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
//# sourceMappingURL=seed.js.map