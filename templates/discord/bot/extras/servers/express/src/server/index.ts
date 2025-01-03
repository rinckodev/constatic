import express from "express";
import cors from "cors";
import type { Client } from "discord.js";
import { log } from "#settings";
import ck from "chalk";
import { registerAllRoutes } from "./routes/index.js";

export const serverInfo = {
    port: process.env.SERVER_PORT || 3000,
    baseURL: process.env.SERVER_BASE_URL
};

export function startServer(client: Client<true>){
    const app = express();
    app.use(express.json(), cors());

    registerAllRoutes(app, client);

    app.listen(serverInfo.port, () => {
        log.log(ck.green(`➝ ${ck.underline("Express")} server listening on port ${serverInfo.port}`));
    });
}