import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedOrganization() {
  await prisma.organization.upsert({
    where: {
      code: 'ECOCITY',
    },
    update: {},
    create: {
      name: 'EcoCity',
      code: 'ECOCITY',
      email: 'contact@ecocity.com',
      phone: '+2290100000000',
      address: 'Cotonou',
      city: 'Cotonou',
      country: 'Benin',
      description: 'Default organization',
      isActive: true,
    },
  });

  console.log('✅ Organization seeded');
}