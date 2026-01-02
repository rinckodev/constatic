import { createEvent } from "#base";
import { env } from "#env";
import express from "express";
import cors from "cors";
import ck from "chalk";
import { registerRoutes } from "./routes/index.js";

const app = express();
app.use(express.json(), cors());

createEvent({
    name: "Start Express Server",
    event: "clientReady", once: true,
    async run(client) {
        registerRoutes(app, client);

        const port = env.SERVER_PORT ?? 3000;

        app.listen(port, "0.0.0.0", () => {
            console.log(ck.green(`● ${ck.underline("Express")} server listening on port ${port}`));
        });
    },
});