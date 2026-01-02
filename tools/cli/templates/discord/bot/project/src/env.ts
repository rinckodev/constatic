import "./constants.js";
import { validateEnv } from "@constatic/base";
import { z } from "zod";

export const env = await validateEnv(z.looseObject({
    BOT_TOKEN: z.string("Discord Bot Token is required").min(1),
    WEBHOOK_LOGS_URL: z.url().optional(),
    GUILD_ID: z.string().optional()
}));