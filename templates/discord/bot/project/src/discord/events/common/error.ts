import { createEvent, logger } from "#base";

createEvent({
    name: "Error handler",
    event: "error",
    async run(error) {
        logger.error(error);
    },
});