import { Client } from "discord.js";

interface ClientStartOptions {
	whenReady?(client: Client<true>): void;
}

declare module "discord.js" {
	interface Client {
		start(options?: ClientStartOptions): void;
	}
}