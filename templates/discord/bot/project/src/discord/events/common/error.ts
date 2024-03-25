import { Event } from "#base";
import { log } from "#settings";

new Event({
    name: "Error handler",
    event: "error",
    async run(error) {
        log.error(error);
    },
});