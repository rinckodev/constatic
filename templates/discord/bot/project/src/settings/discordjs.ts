import { Client } from "discord.js";

interface ClientStartOptions {
	whenReady?(client: Client<true>): void;
	loadDirectories?: boolean;
	loadLogs?: boolean;
}

declare module "discord.js" {
	interface Client {
		start(options?: ClientStartOptions): void;
	}
}