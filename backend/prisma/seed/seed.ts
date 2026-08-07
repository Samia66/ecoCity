import {
    seedRoles,
} from './roles.seed';

import {
    seedPermissions,
} from './permissions.seed';

import {
    seedRolePermissions,
} from './role-permissions.seed';

import {
    seedOrganization,
} from './organization.seed';

import {
    seedAdmin,
} from './admin.seed';

async function main() {

    console.log(
        '🌱 Seeding database...',
    );

    await seedRoles();

    await seedPermissions();

    await seedRolePermissions();

    await seedOrganization();

    await seedAdmin();

    console.log(
        '✅ Database seeded successfully.',
    );

}

main()
    .catch(console.error);