import { PrismaClient, RoleName } from '@prisma/client';
import { DEFAULT_ROLE } from 'src/modules/auth/constants/auth.roles';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding EcoCity...');

    const roles = [
        {
            name: RoleName.SUPER_ADMIN,
            description: 'Platform administrator',
        },
        {
            name: RoleName.ADMIN,
            description: 'Organization administrator',
        },
        {
            name: RoleName.AGENT,
            description: 'Field agent',
        },
        {
            name: DEFAULT_ROLE,
            description: 'Citizen',
        },
    ];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: {},
            create: role,
        });
    }

    console.log('✅ Roles inserted');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });