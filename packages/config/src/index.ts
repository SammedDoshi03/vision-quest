import { z } from 'zod';

export const EnvironmentSchema = z.enum(['development', 'qat', 'staging', 'production']);
export type Environment = z.infer<typeof EnvironmentSchema>;

export const DataSourceModeSchema = z.enum(['mock', 'firebase', 'postgres']);
export type DataSourceMode = z.infer<typeof DataSourceModeSchema>;

export const AppConfigSchema = z.object({
  nodeEnv: EnvironmentSchema.default('development'),
  port: z.coerce.number().default(3000),
  apiPrefix: z.string().default('api/v1'),
  activeDataSource: DataSourceModeSchema.default('mock'),

  database: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(5432),
    user: z.string().default('postgres'),
    password: z.string().default('postgres'),
    name: z.string().default('resonance_dev'),
    ssl: z.coerce.boolean().default(false),
    poolMin: z.coerce.number().default(2),
    poolMax: z.coerce.number().default(10),
  }),

  redis: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(6379),
    password: z.string().optional(),
    ttlDefaultSeconds: z.coerce.number().default(300),
  }),

  firebase: z.object({
    projectId: z.string().default('healthcare-dev'),
    databaseUrl: z.string().default('https://healthcare-dev-rtdb.firebaseio.com'),
    clientEmail: z.string().default('admin@healthcare-dev.iam.gserviceaccount.com'),
    privateKey: z.string().default('mock_private_key'),
  }),

  security: z.object({
    jwtAccessSecret: z.string().default('dev_jwt_access_secret_key_32bytes_long'),
    jwtRefreshSecret: z.string().default('dev_jwt_refresh_secret_key_32bytes_long'),
    corsOrigin: z.string().default('*'),
  }),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

export function loadAppConfig(env: Record<string, string | undefined> = process.env): AppConfig {
  return AppConfigSchema.parse({
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    apiPrefix: env.API_PREFIX,
    activeDataSource: env.ACTIVE_DATA_SOURCE,
    database: {
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      user: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      name: env.DATABASE_NAME,
      ssl: env.DATABASE_SSL === 'true',
      poolMin: env.DATABASE_POOL_MIN,
      poolMax: env.DATABASE_POOL_MAX,
    },
    redis: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      ttlDefaultSeconds: env.REDIS_TTL_DEFAULT_SECONDS,
    },
    firebase: {
      projectId: env.FIREBASE_PROJECT_ID,
      databaseUrl: env.FIREBASE_DATABASE_URL,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY,
    },
    security: {
      jwtAccessSecret: env.JWT_ACCESS_SECRET,
      jwtRefreshSecret: env.JWT_REFRESH_SECRET,
      corsOrigin: env.CORS_ORIGIN,
    },
  });
}
