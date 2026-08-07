import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRolePermissions() {
  const roles = await prisma.role.findMany({
    include: {
      rolePermissions: true,
    },
  });

  const permissions = await prisma.permission.findMany();

  const permissionMap = new Map(
    permissions.map((p) => [p.code, p.id]),
  );

  const assign = async (
    roleName: RoleName,
    codes: string[],
  ) => {
    const role = roles.find((r) => r.name === roleName);

    if (!role) {
      return;
    }

    for (const code of codes) {
      const permissionId = permissionMap.get(code);

      if (!permissionId) {
        continue;
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId,
        },
      });
    }
  };

  await assign(RoleName.SUPER_ADMIN, permissions.map(p => p.code));

  await assign(RoleName.ADMIN, [
    'users.read',
    'users.create',
    'users.update',

    'reports.read',
    'reports.create',
    'reports.update',
    'reports.assign',
    'reports.resolve',

    'categories.read',
    'categories.create',
    'categories.update',
    'categories.delete',
  ]);

  await assign(RoleName.AGENT, [
    'reports.read',
    'reports.update',
    'reports.resolve',
  ]);

  await assign(RoleName.CITIZEN, [
    'reports.create',
    'reports.read',
  ]);

  console.log('✅ Role permissions seeded');
}