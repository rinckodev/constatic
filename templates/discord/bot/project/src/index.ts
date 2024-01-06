import { createClient } from "#base";
import { log } from "#settings";

const client = createClient();
client.start();

process.on("uncaughtException", log.error);
process.on("unhandledRejection", log.error);