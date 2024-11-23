import { z } from 'zod';

enum Env {
  production = 'production',
  development = 'development',
}

export const configValidationSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  PORT: z.coerce.number(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(Object.values(Env) as [Env.production, Env.development]),
});
