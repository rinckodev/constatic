import type { Client } from "discord.js";
import type { Express } from "express";
import { homeRoutes } from "./home.js";

export function registerRoutes(app: Express, client: Client<true>){
    homeRoutes(app, client);
}