import { addBotDatabaseAction } from "./bot/add/database.js";
import { addBotDiscloudAction } from "./bot/add/discloud.js";
import { addBotServerAction } from "./bot/add/server.js";
import { addBotTsupAction } from "./bot/add/tsup.js";
import { initBotAction } from "./bot/init.js";
import { listEmojisAction } from "./emojis/list.js";

export const actions = {
    bot: {
        init: initBotAction,
        add: {
            database: addBotDatabaseAction,
            server: addBotServerAction,
            tsup: addBotTsupAction,
            discloud: addBotDiscloudAction,
        }
    },
    emojis: {
        list: listEmojisAction,
    }
}