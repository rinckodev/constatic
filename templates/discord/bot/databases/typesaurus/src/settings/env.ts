import { z } from "zod";

const envSchema = z.object({
    BOT_TOKEN: z.string({ description: "Discord Bot Token is required" }).min(1),
    WEBHOOK_LOGS_URL: z.string().url().optional(),
    FIREBASE_PATH: z.string({ description: "Firebase account path is required" }).min(1)
});

type EnvSchema = z.infer<typeof envSchema>;

export { envSchema, EnvSchema };