import express from "express";
import cors from "cors";
import { env, logger } from "#settings";
import ck from "chalk";
import { registerRoutes } from "./routes/index.js";

createEvent({
    name: "Start Fastify Server",
    event: "ready", once: true,
    async run(client) {
        const app = express();
        app.use(express.json(), cors());

        registerRoutes(app, client);

        const port = env.SERVER_PORT ?? 3000;

        app.listen(port, "0.0.0.0", () => {
            logger.log(ck.green(`● ${ck.underline("Express")} server listening on port ${port}`));
        });
    },
});