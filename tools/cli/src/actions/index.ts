import { addBotDatabaseAction } from "./bot/add/database.js";
import { addBotDiscloudAction } from "./bot/add/discloud.js";
import { addBotServerAction } from "./bot/add/server.js";
import { addBotTsupAction } from "./bot/add/tsup.js";
import { initBotAction } from "./bot/init.js";
import { emojisDeleteAction } from "./emojis/delete.js";
import { emojisFileAction } from "./emojis/file.js";
import { emojisListAction } from "./emojis/list.js";
import { emojisScanAction } from "./emojis/scan.js";
import { emojisUploadAction } from "./emojis/upload.js";
import { scriptsListAction } from "./scripts/list.js";

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
        list: emojisListAction,
        file: emojisFileAction,
        upload: emojisUploadAction,
        scan: emojisScanAction,
        delete: emojisDeleteAction,
    },
    scripts: {
        list: scriptsListAction
    }
}