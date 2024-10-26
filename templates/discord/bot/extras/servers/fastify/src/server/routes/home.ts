import { defineRoutes } from "#server";
import { StatusCodes } from "http-status-codes";

export default defineRoutes((app, client) => {
    app.get("/", (_, res) => {
        return res.status(StatusCodes.OK).send({
            message: `🍃 Online on discord as ${client.user.username}`,
            guilds: client.guilds.cache.size,
            users: client.users.cache.size
        });
    });
});