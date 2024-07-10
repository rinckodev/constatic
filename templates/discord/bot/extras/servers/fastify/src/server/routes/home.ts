import type { Client } from "discord.js";
import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";

export function homeRoutes(app: FastifyInstance, client: Client<true>){
    app.get("/", (_, res) => {
        res.status(StatusCodes.OK).send({
            message: `🍃 Online on discord as ${client.user.username}`,
            guilds: client.guilds.cache.size,
            users: client.users.cache.size
        });
    });
}