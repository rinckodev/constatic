declare module NodeJS {
	interface ProcessEnv {
		readonly BOT_TOKEN: string;
		readonly WEBHOOK_LOGS_URL: string | undefined;
	}
}