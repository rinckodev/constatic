import express from "express";
import cors from "cors";
import type { Client } from "discord.js";
import { log } from "#settings";
import ck from "chalk";
import { registerAllRoutes } from "./routes/index.js";

export function startServer(client: Client<true>){
    const app = express();
    app.use(express.json(), cors());

    registerAllRoutes(app, client);

    const port = Number(process.env.SERVER_PORT ?? 3000);

    app.listen(port, "0.0.0.0", () => {
        log.log(ck.green(`➝ ${ck.underline("Express")} server listening on port ${port}`));
    });
}