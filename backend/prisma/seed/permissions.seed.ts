import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPermissions() {
  const permissions = [
    'users.read',
    'users.create',
    'users.update',
    'users.delete',

    'roles.read',
    'roles.create',
    'roles.update',
    'roles.delete',

    'permissions.read',
    'permissions.assign',

    'organizations.read',
    'organizations.update',

    'categories.read',
    'categories.create',
    'categories.update',
    'categories.delete',

    'reports.read',
    'reports.create',
    'reports.update',
    'reports.delete',
    'reports.assign',
    'reports.resolve',
    'reports.close',

    'notifications.read',
    'notifications.send',

    'audit.read',
  ];

  for (const code of permissions) {
    await prisma.permission.upsert({
      where: {
        code,
      },
      update: {},
      create: {
        code,
        name: code,
      },
    });
  }

  console.log('✅ Permissions seeded');
}