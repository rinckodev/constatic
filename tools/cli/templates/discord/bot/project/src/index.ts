import { env } from "#env";
import { bootstrap } from "@constatic/base";

await bootstrap({ meta: import.meta, env });