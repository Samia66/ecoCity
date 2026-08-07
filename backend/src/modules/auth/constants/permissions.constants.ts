export const PERMISSIONS = {

  USERS: {
    READ: 'users.read',
    CREATE: 'users.create',
    UPDATE: 'users.update',
    DELETE: 'users.delete',
  },

  ROLES: {
    READ: 'roles.read',
    CREATE: 'roles.create',
    UPDATE: 'roles.update',
    DELETE: 'roles.delete',
  },

  PERMISSIONS: {
    READ: 'permissions.read',
    ASSIGN: 'permissions.assign',
  },

  ORGANIZATIONS: {
    READ: 'organizations.read',
    UPDATE: 'organizations.update',
  },

  CATEGORIES: {
    READ: 'categories.read',
    CREATE: 'categories.create',
    UPDATE: 'categories.update',
    DELETE: 'categories.delete',
  },

  REPORTS: {
    READ: 'reports.read',
    CREATE: 'reports.create',
    UPDATE: 'reports.update',
    DELETE: 'reports.delete',
    ASSIGN: 'reports.assign',
    RESOLVE: 'reports.resolve',
    CLOSE: 'reports.close',
  },

  NOTIFICATIONS: {
    READ: 'notifications.read',
    SEND: 'notifications.send',
  },

  AUDIT: {
    READ: 'audit.read',
  },

} as const;