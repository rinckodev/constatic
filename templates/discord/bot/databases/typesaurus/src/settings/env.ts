import { z } from "zod";

const envSchema = z.object({
    BOT_TOKEN: z.string({ description: "Discord Bot Token is required" }).readonly(),
    WEBHOOK_LOGS_URL: z.string().url().optional(),
    FIREBASE_PATH: z.string({ description: "Firebase account path is required" })
});

envSchema.parse(process.env);

type EnvVars = Readonly<z.infer<typeof envSchema>>

declare global {
    namespace NodeJS {
        interface ProcessEnv extends EnvVars {}
    }
}