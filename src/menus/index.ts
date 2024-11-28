import { botMenu } from "./bot/menu.js";
import { discordEmojisDeleteMenu } from "./emojis/delete/menu.js";
import { discordEmojisFileMenu } from "./emojis/file/menu.js";
import { discordEmojisListMenu } from "./emojis/list/menu.js";
import { discordEmojisMenu } from "./emojis/menu.js";
import { discordEmojisUploadMenu } from "./emojis/upload/menu.js";
import { mainMenu } from "./main/menu.js";
import { settingsMenu } from "./settings/menu.js";
import { tokenSettingsMenu } from "./settings/tokens/menu.js";

export const menus = {
    main: mainMenu,
    bot: botMenu,
    emojis: {
        list: discordEmojisListMenu,
        upload: discordEmojisUploadMenu,
        delete: discordEmojisDeleteMenu,
        file: discordEmojisFileMenu,
        main: discordEmojisMenu,
    },
    settings: {
        main: settingsMenu,
        tokens: tokenSettingsMenu
    }
};