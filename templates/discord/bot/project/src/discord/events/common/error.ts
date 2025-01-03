import { createEvent } from "#base";
import { log } from "#settings";

createEvent({
    name: "Error handler",
    event: "error",
    async run(error) {
        log.error(error);
    },
});