import { bootstrapApp } from "#base";
import { bootstrapServer } from "#server";

await bootstrapApp({ 
    workdir: import.meta.dirname,
    whenReady: bootstrapServer
});