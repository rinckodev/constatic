import type { Client } from "discord.js";
import type { FastifyInstance } from "fastify";
import { homeRoutes } from "./home.js";

export function registerAllRoutes(app: FastifyInstance, client: Client<true>){
    homeRoutes(app, client);
}