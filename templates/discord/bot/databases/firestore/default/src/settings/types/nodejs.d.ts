declare module NodeJS {
	interface ProcessEnv {
		readonly BOT_TOKEN: string;
		readonly FIREBASE_PATH: string;
	}
}