import { z } from "zod";

const isFrontendOnly = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DATABASE_URL: isFrontendOnly ? z.string().optional() : z.string(),
  GOOGLE_CLIENT_ID: isFrontendOnly ? z.string().optional() : z.string(),
  GOOGLE_CLIENT_SECRET: isFrontendOnly ? z.string().optional() : z.string(),
  ENCRYPTION_KEY: isFrontendOnly ? z.string().optional() : z.string(),
  UPSTASH_VECTOR_REST_URL: isFrontendOnly ? z.string().optional() : z.string(),
  UPSTASH_VECTOR_REST_TOKEN: isFrontendOnly ? z.string().optional() : z.string(),
  OPENAI_API_KEY: z.string().optional(), // Already optional
});

const env = envSchema.parse(process.env);

export default env;
