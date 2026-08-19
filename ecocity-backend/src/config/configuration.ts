export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  publicUrl: string;
  corsOrigins: string[];
  database: { url: string };
  jwt: {
    accessSecret: string;
    accessExpiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  bcryptSaltRounds: number;
  upload: { dir: string; maxSizeMb: number };
  seed: { superAdminEmail: string; superAdminPassword: string };
}

export default (): { app: AppConfig } => ({
  app: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    apiPrefix: process.env.API_PREFIX ?? 'api/v1',
    publicUrl: process.env.PUBLIC_URL ?? `http://localhost:${process.env.PORT ?? '3000'}`,
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:4200')
      .split(',')
      .map((origin) => origin.trim()),
    database: {
      url: process.env.DATABASE_URL ?? '',
    },
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
      refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    },
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10),
    upload: {
      dir: process.env.UPLOAD_DIR ?? 'uploads',
      maxSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE_MB ?? '10', 10),
    },
    seed: {
      superAdminEmail: process.env.SEED_SUPER_ADMIN_EMAIL ?? 'admin@ecocity.app',
      superAdminPassword: process.env.SEED_SUPER_ADMIN_PASSWORD ?? 'EcoCity2026!',
    },
  },
});
