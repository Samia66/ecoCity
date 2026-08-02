import { PrismaClient, RoleName } from '@prisma/client';

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
            name: RoleName.CITIZEN,
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