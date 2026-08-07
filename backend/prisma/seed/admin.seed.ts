import { PrismaClient, RoleName } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedAdmin() {
  const organization = await prisma.organization.findUnique({
    where: {
      code: 'ECOCITY',
    },
  });

  if (!organization) {
    throw new Error('Organization not found');
  }

  const role = await prisma.role.findUnique({
    where: {
      name: RoleName.SUPER_ADMIN,
    },
  });

  if (!role) {
    throw new Error('SUPER_ADMIN role not found');
  }

  const password = await bcrypt.hash(
    'Admin@123',
    10,
  );

  await prisma.user.upsert({
    where: {
      email: 'admin@ecocity.com',
    },

    update: {},

    create: {
      firstName: 'Super',
      lastName: 'Admin',

      email: 'admin@ecocity.com',

      password,

      organizationId: organization.id,

      roleId: role.id,

      status: 'ACTIVE',

      isEmailVerified: true,
    },
  });

  console.log('✅ Super Admin seeded');
}