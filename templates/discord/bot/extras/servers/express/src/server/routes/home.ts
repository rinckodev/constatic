import type { Client } from "discord.js";
import type { Express } from "express";
import { StatusCodes } from "http-status-codes";

export function homeRoutes(app: Express, client: Client<true>){
    app.get("/", (_, res) => {
        res.status(StatusCodes.OK).send({
            message: `🍃 Online on discord as ${client.user.username}`,
            guilds: client.guilds.cache.size,
            users: client.users.cache.size
        });
    });
}