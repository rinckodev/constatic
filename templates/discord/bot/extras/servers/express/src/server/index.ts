import express from "express";
import cors from "cors";
import type { Client } from "discord.js";
import { env, logger } from "#settings";
import ck from "chalk";
import { registerAllRoutes } from "./routes/index.js";

export function startServer(client: Client<true>){
    const app = express();
    app.use(express.json(), cors());

    registerAllRoutes(app, client);

    const port = Number(env.SERVER_PORT ?? 3000);

    app.listen(port, "0.0.0.0", () => {
        logger.log(ck.green(`● ${ck.underline("Express")} server listening on port ${port}`));
    });
}