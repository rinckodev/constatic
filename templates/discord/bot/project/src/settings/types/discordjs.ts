import { Client } from "discord.js";

declare module "discord.js" {
	interface Client {
		start(options?: ClientStartOptions): void;
	}
}

interface ClientStartOptions {
	whenReady?(client: Client<true>): void;
}
