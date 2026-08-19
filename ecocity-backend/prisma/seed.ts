import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { RoleName } from '../src/common/constants/roles.constant';
import {
  PERMISSION_CATALOG,
  PermissionCode,
} from '../src/common/constants/permissions.constant';
import { REPORT_CATEGORIES } from './seed-data/categories';

const prisma = new PrismaClient();

const ROLE_PERMISSIONS: Record<RoleName, PermissionCode[]> = {
  [RoleName.SUPER_ADMIN]: PERMISSION_CATALOG.map((p) => p.code),

  [RoleName.ADMIN]: [
    PermissionCode.REPORTS_VIEW,
    PermissionCode.REPORTS_MANAGE,
    PermissionCode.REPORTS_DELETE,
    PermissionCode.INTERVENTIONS_VIEW,
    PermissionCode.INTERVENTIONS_ASSIGN,
    PermissionCode.INTERVENTIONS_UPDATE,
    PermissionCode.USERS_VIEW,
    PermissionCode.USERS_MANAGE,
    PermissionCode.CATEGORIES_MANAGE,
    PermissionCode.ROLES_MANAGE,
    PermissionCode.SETTINGS_MANAGE,
    PermissionCode.DASHBOARD_VIEW_ORGANIZATION,
    PermissionCode.ORGANIZATIONS_VIEW,
    PermissionCode.TEAMS_VIEW,
    PermissionCode.TEAMS_MANAGE,
    PermissionCode.ZONES_VIEW,
    PermissionCode.ZONES_MANAGE,
    PermissionCode.COLLECTION_SCHEDULES_MANAGE,
    PermissionCode.COLLECTIONS_VIEW,
    PermissionCode.COLLECTIONS_MANAGE,
  ],

  // Le CHEF_EQUIPE consulte sa propre équipe/zones/planning et pilote les
  // collectes de son équipe, mais ne crée/modifie plus les équipes ou zones
  // elles-mêmes (réservé à l'ADMIN).
  [RoleName.TEAM_LEADER]: [
    PermissionCode.REPORTS_VIEW,
    PermissionCode.INTERVENTIONS_VIEW,
    PermissionCode.INTERVENTIONS_ASSIGN,
    PermissionCode.INTERVENTIONS_UPDATE,
    PermissionCode.USERS_VIEW,
    PermissionCode.DASHBOARD_VIEW_ORGANIZATION,
    PermissionCode.TEAMS_VIEW,
    PermissionCode.ZONES_VIEW,
    PermissionCode.COLLECTIONS_VIEW,
    PermissionCode.COLLECTIONS_MANAGE,
  ],

  [RoleName.AGENT]: [
    PermissionCode.REPORTS_VIEW,
    PermissionCode.INTERVENTIONS_VIEW,
    PermissionCode.INTERVENTIONS_UPDATE,
    PermissionCode.TEAMS_VIEW,
    PermissionCode.ZONES_VIEW,
    PermissionCode.COLLECTIONS_VIEW,
    PermissionCode.COLLECTIONS_MANAGE,
  ],

  [RoleName.CITIZEN]: [
    PermissionCode.REPORTS_CREATE,
    PermissionCode.REPORTS_VIEW,
  ],
};

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

async function main(): Promise<void> {
  console.log('🌱 Démarrage du seed EcoCity...');

  // -------------------------------------------------------------------
  // Permissions
  // -------------------------------------------------------------------
  for (const permission of PERMISSION_CATALOG) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: {
        label: permission.label,
        module: permission.module,
      },
      create: permission,
    });
  }

  console.log(`✔ ${PERMISSION_CATALOG.length} permissions synchronisées`);

  // -------------------------------------------------------------------
  // Rôles système
  // -------------------------------------------------------------------
  const roleIds: Record<string, string> = {};

  for (const roleName of Object.values(RoleName)) {
    const permissionCodes = ROLE_PERMISSIONS[roleName];

    const role = await prisma.role.upsert({
      where: { name: roleName },

      update: {
        isSystem: true,
        permissions: {
          set: permissionCodes.map((code) => ({ code })),
        },
      },

      create: {
        name: roleName,
        description: `Rôle système ${roleName}`,
        isSystem: true,

        permissions: {
          connect: permissionCodes.map((code) => ({ code })),
        },
      },
    });

    roleIds[roleName] = role.id;
  }

  console.log(
    '✔ 5 rôles système synchronisés (SUPER_ADMIN, ADMIN, TEAM_LEADER, AGENT, CITIZEN)',
  );

  // -------------------------------------------------------------------
  // Organisation par défaut
  // -------------------------------------------------------------------
  const organization = await prisma.organization.upsert({
    where: { id: 'seed-org-cotonou' },

    update: {},

    create: {
      id: 'seed-org-cotonou',
      name: 'Mairie de Cotonou',
      city: 'Cotonou',
      address: "Place de l'Étoile Rouge",
      phone: '+229 21 30 00 00',
      email: 'contact@cotonou.bj',
    },
  });

  console.log(`✔ Organisation par défaut : ${organization.name}`);

  // -------------------------------------------------------------------
  // Catégories
  // -------------------------------------------------------------------
  for (const category of REPORT_CATEGORIES) {
    const existing = await prisma.category.findFirst({
      where: {
        name: category.name,
        organizationId: organization.id,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: category.name,
          icon: category.icon,
          organizationId: organization.id,
        },
      });
    }
  }

  console.log(
    `✔ ${REPORT_CATEGORIES.length} catégories de signalement créées`,
  );

  // -------------------------------------------------------------------
  // Zones
  // -------------------------------------------------------------------
  await prisma.zone.upsert({
    where: { id: 'seed-zone-centre' },

    update: {},

    create: {
      id: 'seed-zone-centre',
      name: 'Centre-ville',
      description: 'Zone couvrant le centre-ville de Cotonou',
      organizationId: organization.id,
    },
  });

  const zoneZongoNord = await prisma.zone.upsert({
    where: { id: 'seed-zone-zongo-nord' },
    update: {},
    create: {
      id: 'seed-zone-zongo-nord',
      name: 'Zongo Nord',
      description: 'Zone résidentielle située au nord du quartier Zongo, Cotonou.',
      organizationId: organization.id,
    },
  });

  const zoneZongoSud = await prisma.zone.upsert({
    where: { id: 'seed-zone-zongo-sud' },
    update: {},
    create: {
      id: 'seed-zone-zongo-sud',
      name: 'Zongo Sud',
      description: 'Zone résidentielle située au sud du quartier Zongo, Cotonou.',
      organizationId: organization.id,
    },
  });

  console.log('✔ Zones créées (Centre-ville, Zongo Nord, Zongo Sud)');

  // -------------------------------------------------------------------
  // Comptes de démonstration
  // -------------------------------------------------------------------
  const superAdminEmail =
    process.env.SEED_SUPER_ADMIN_EMAIL ?? 'admin@ecocity.app';

  const superAdminPassword =
    process.env.SEED_SUPER_ADMIN_PASSWORD ?? 'EcoCity2026!';

  const demoAccounts = [
    {
      email: superAdminEmail,
      password: superAdminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: RoleName.SUPER_ADMIN,
      mustChangePassword: false,
    },

    {
      email: 'admin@cotonou.bj',
      password: 'Demo2026!',
      firstName: 'Olivia',
      lastName: 'Fanou',
      role: RoleName.ADMIN,
      mustChangePassword: false,
    },

    {
      email: 'chef.equipe@cotonou.bj',
      password: 'Demo2026!',
      firstName: 'Marcel',
      lastName: 'Sossou',
      role: RoleName.TEAM_LEADER,
      mustChangePassword: false,
    },

    {
      email: 'agent@cotonou.bj',
      password: 'Demo2026!',
      firstName: 'Roland',
      lastName: 'Dansou',
      role: RoleName.AGENT,
      mustChangePassword: false,
    },

    {
      email: 'agent2@cotonou.bj',
      password: 'Demo2026!',
      firstName: 'Michel',
      lastName: 'Adjovi',
      role: RoleName.AGENT,
      mustChangePassword: false,
    },

    {
      email: 'citoyen@example.com',
      password: 'Demo2026!',
      firstName: 'Aïcha',
      lastName: 'Kouassi',
      role: RoleName.CITIZEN,
      mustChangePassword: false,
    },
  ];

  for (const account of demoAccounts) {
    const hashedPassword = await hashPassword(account.password);
await prisma.user.upsert({
  where: { email: account.email },

  update: {
    password: hashedPassword,
    firstName: account.firstName,
    lastName: account.lastName,
    mustChangePassword: account.mustChangePassword,
    isEmailVerified: true,
    organizationId: organization.id,
    roleId: roleIds[account.role],
  },

  create: {
    email: account.email,
    password: hashedPassword,
    firstName: account.firstName,
    lastName: account.lastName,
    mustChangePassword: account.mustChangePassword,
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
    organizationId: organization.id,
    roleId: roleIds[account.role],
  },
});
  }

  console.log(
    `✔ ${demoAccounts.length} comptes de démonstration créés`,
  );

  // -------------------------------------------------------------------
  // Équipe Zongo : chef Marcel, agents Roland + Michel, zones Zongo
  // Nord/Sud, planning de collecte (cf. cahier des charges §18)
  // -------------------------------------------------------------------
  const teamLeader = await prisma.user.findUnique({ where: { email: 'chef.equipe@cotonou.bj' } });
  const agentRoland = await prisma.user.findUnique({ where: { email: 'agent@cotonou.bj' } });
  const agentMichel = await prisma.user.findUnique({ where: { email: 'agent2@cotonou.bj' } });

  if (teamLeader && agentRoland && agentMichel) {
    const existingTeam = await prisma.team.findFirst({ where: { id: 'seed-team-zongo' } });

    if (!existingTeam) {
      await prisma.team.create({
        data: {
          id: 'seed-team-zongo',
          name: 'Équipe Zongo',
          description: 'Équipe responsable de la collecte des déchets dans le quartier Zongo.',
          status: 'ACTIVE',
          organizationId: organization.id,
          createdById: teamLeader.id,
          createdByName: `${teamLeader.firstName} ${teamLeader.lastName}`,
          members: {
            create: [
              {
                agentId: teamLeader.id,
                agentName: `${teamLeader.firstName} ${teamLeader.lastName}`,
                agentEmail: teamLeader.email,
                role: 'LEADER',
              },
              {
                agentId: agentRoland.id,
                agentName: `${agentRoland.firstName} ${agentRoland.lastName}`,
                agentEmail: agentRoland.email,
                role: 'AGENT',
              },
              {
                agentId: agentMichel.id,
                agentName: `${agentMichel.firstName} ${agentMichel.lastName}`,
                agentEmail: agentMichel.email,
                role: 'AGENT',
              },
            ],
          },
          teamZones: {
            create: [{ zoneId: zoneZongoNord.id }, { zoneId: zoneZongoSud.id }],
          },
          schedules: {
            create: [
              { zoneId: zoneZongoNord.id, dayOfWeek: 'MERCREDI', startTime: '08:00', endTime: '12:00' },
              { zoneId: zoneZongoNord.id, dayOfWeek: 'SAMEDI', startTime: '08:00', endTime: '12:00' },
              { zoneId: zoneZongoSud.id, dayOfWeek: 'LUNDI', startTime: '08:00', endTime: '12:00' },
              { zoneId: zoneZongoSud.id, dayOfWeek: 'JEUDI', startTime: '08:00', endTime: '12:00' },
            ],
          },
        },
      });

      console.log(
        '✔ Équipe Zongo créée (chef Marcel, agents Roland + Michel, zones Zongo Nord/Sud, planning Mer+Sam / Lun+Jeu)',
      );
    }
  }

  console.log('🌿 Seed terminé avec succès.');
  console.log('----------------------------------------------------');
  console.log(`Super Admin : ${superAdminEmail} / ${superAdminPassword}`);
  console.log('Admin       : admin@cotonou.bj / Demo2026!');
  console.log('Chef équipe : chef.equipe@cotonou.bj / Demo2026!');
  console.log('Agent       : agent@cotonou.bj / Demo2026!');
  console.log('Agent 2     : agent2@cotonou.bj / Demo2026!');
  console.log('Citoyen     : citoyen@example.com / Demo2026!');
  console.log('----------------------------------------------------');
}

main()
  .catch((error) => {
    console.error('❌ Erreur durant le seed :', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });