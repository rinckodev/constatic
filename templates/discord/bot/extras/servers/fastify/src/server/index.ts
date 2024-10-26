import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import autoload from "@fastify/autoload";
import type { Client } from "discord.js";
import { log } from "#settings";
import ck from "chalk";
import path from "node:path";

export async function bootstrapServer(client: Client<true>){
    const app = fastify();
    app.register(cors, { origin: "*" });
    app.register(autoload, {
        dir: path.join(import.meta.dirname, "routes"),
        routeParams: true,
        options: client,
    });

    const port = process.env.SERVER_PORT || 3000

    await app.listen({ port, host: "0.0.0.0" })
    .catch(err => {
        log.error(err);
        process.exit(1);
    });
    log.log(ck.green(`➝ ${ck.underline("Fastify")} server listening on port ${port}`));
}

export type RouteHandler = (app: FastifyInstance, client: Client<true>, done: Function) => any;
export function defineRoutes(handler: RouteHandler){
    return (...[app, client, done]: Parameters<RouteHandler>) => {
        handler(app, client, done);
        done();
    }
}