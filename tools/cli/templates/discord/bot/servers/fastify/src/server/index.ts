import { createEvent } from "#base";
import { env } from "#env";
import cors from "@fastify/cors";
import ck from "chalk";
import fastify from "fastify";
import { registerRoutes } from "./routes/index.js";

const app = fastify();
app.register(cors, { origin: "*" });

createEvent({
    name: "Start Fastify Server",
    event: "clientReady", once: true,
    async run(client) {
        registerRoutes(app, client);

        const port = env.SERVER_PORT ?? 3000;

        await app.listen({ port, host: "0.0.0.0" })
        .then(() => {
            console.log(ck.green(
                `● ${ck.underline("Fastify")} server listening on port ${port}`
            ));
        })
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
    },
});