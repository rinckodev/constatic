import { discordEmojisDeleteMenu } from "./main/discord/emojis/menu-delete.js";
import { discordEmojisFileMenu } from "./main/discord/emojis/menu-file.js";
import { discordEmojisListMenu } from "./main/discord/emojis/menu-list.js";
import { selectDiscordBot } from "./main/discord/emojis/menu-select.js";
import { discordEmojisUploadMenu } from "./main/discord/emojis/menu-upload.js";
import { discordEmojisMenu } from "./main/discord/emojis/menu.js";
import { mainMenu } from "./main/menu.js";
import { settingsLangMenu } from "./main/settings/lang/menu.js";
import { settingsMenu } from "./main/settings/menu.js";
import { settingsTokensDeleteMenu } from "./main/settings/tokens/menu-delete.js";
import { settingsTokensListMenu } from "./main/settings/tokens/menu-list.js";
import { settingsTokensNewMenu } from "./main/settings/tokens/menu-new.js";
import { settingsTokensMenu } from "./main/settings/tokens/menu.js";

export const menus = {
    main: mainMenu,
    discord: {
        emojis: {
            main: discordEmojisMenu,
            list: discordEmojisListMenu,
            upload: discordEmojisUploadMenu,
            file: discordEmojisFileMenu,
            delete: discordEmojisDeleteMenu,
            select: selectDiscordBot,
        },  
    },
    settings: {
        main: settingsMenu,
        lang: settingsLangMenu,
        tokens: {
            main: settingsTokensMenu,
            new: settingsTokensNewMenu,
            list: settingsTokensListMenu,
            delete: settingsTokensDeleteMenu
        }
    }
}