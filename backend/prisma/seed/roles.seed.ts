import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRoles() {
  const roles = [
    {
      name: RoleName.SUPER_ADMIN,
      description: 'Super Administrator',
    },
    {
      name: RoleName.ADMIN,
      description: 'Administrator',
    },
    {
      name: RoleName.AGENT,
      description: 'Field Agent',
    },
    {
      name: RoleName.CITIZEN,
      description: 'Citizen',
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        description: role.description,
      },
      create: role,
    });
  }

  console.log('✅ Roles seeded');
}