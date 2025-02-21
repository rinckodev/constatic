import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import autoload from "@fastify/autoload";
import type { Client } from "discord.js";
import { logger } from "#settings";
import ck from "chalk";
import path from "node:path";

export async function startServer(client: Client<true>){
    const app = fastify();
    app.addHook("onRoute", route => {
        if (route.method === "HEAD" || route.method === "OPTIONS") return;
        logger.success(`${ck.yellow(route.method)} ${ck.blue(route.path)}`);
    });
    app.register(cors, { origin: "*" });
    app.register(autoload, {
        dir: path.join(import.meta.dirname, "routes"),
        routeParams: true,
        options: client,
    });

    const port = Number(process.env.SERVER_PORT ?? 3000);

    await app.listen({ port, host: "0.0.0.0" })
    .catch(err => {
        logger.error(err);
        process.exit(1);
    });
    logger.log(ck.green(`● ${ck.underline("Fastify")} server listening on port ${port}`));
}

export type RouteHandler = (app: FastifyInstance, client: Client<true>, done: Function) => any;
export function defineRoutes(handler: RouteHandler){
    return (...[app, client, done]: Parameters<RouteHandler>) => {
        handler(app, client, done);
        done();
    }
}