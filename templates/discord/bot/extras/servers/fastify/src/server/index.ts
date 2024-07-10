import fastify from "fastify";
import cors from "@fastify/cors";
import type { Client } from "discord.js";
import { log } from "#settings";
import ck from "chalk";
import { registerAllRoutes } from "./routes/index.js";

export const serverInfo = {
    port: Number(process.env.SERVER_PORT || 3000),
    baseURL: process.env.SERVER_BASE_URL
};

export async function bootstrapServer(client: Client<true>){
    const app = fastify();
    app.register(cors, { origin: "*" });

    registerAllRoutes(app, client);

    await app.listen({ port: serverInfo.port })
    .catch(err => {
        log.error(err);
        process.exit(1);
    });
    log.log(ck.green(`➝ ${ck.underline("Fastify")} server listening on port ${serverInfo.port}`));
}