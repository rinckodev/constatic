import { discordBotMenu } from "./main/discord/bot/menu.js";
import { discordEmojisDeleteMenu } from "./main/discord/emojis/menu-delete.js";
import { discordEmojisFileMenu } from "./main/discord/emojis/menu-file.js";
import { discordEmojisListMenu } from "./main/discord/emojis/menu-list.js";
import { selectDiscordBot } from "./main/discord/emojis/menu-select.js";
import { discordEmojisUploadMenu } from "./main/discord/emojis/menu-upload.js";
import { discordEmojisMenu } from "./main/discord/emojis/menu.js";
import { mainMenu } from "./main/menu.js";
import { presetsMenu } from "./main/presets/menu.js";
import { presetsScriptsApplyMenu } from "./main/presets/scripts/menu-apply.js";
import { presetsScriptsDeleteMenu } from "./main/presets/scripts/menu-delete.js";
import { presetsScriptsEditMenu } from "./main/presets/scripts/menu-edit.js";
import { presetsScriptsListMenu } from "./main/presets/scripts/menu-list.js";
import { presetsScriptsNewMenu } from "./main/presets/scripts/menu-new.js";
import { scriptPresetsMenu } from "./main/presets/scripts/menu.js";
import { promptToken } from "./main/presets/tokens/actions/prompt.js";
import { presetsTokensDeleteMenu } from "./main/presets/tokens/menu-delete.js";
import { presetsTokensEditMenu } from "./main/presets/tokens/menu-edit.js";
import { presetsTokensListMenu } from "./main/presets/tokens/menu-list.js";
import { presetsTokensNewMenu } from "./main/presets/tokens/menu-new.js";
import { presetsTokensMenu } from "./main/presets/tokens/menu.js";
import { settingsLangMenu } from "./main/settings/lang/menu.js";
import { settingsMenu } from "./main/settings/menu.js";

export const menus = {
    main: mainMenu,
    discord: {
        bot: discordBotMenu,
        emojis: {
            main: discordEmojisMenu,
            list: discordEmojisListMenu,
            upload: discordEmojisUploadMenu,
            file: discordEmojisFileMenu,
            delete: discordEmojisDeleteMenu,
            select: selectDiscordBot,
        },
    },
    presets: {
        main: presetsMenu,
        scripts: {
            main: scriptPresetsMenu,
            new: presetsScriptsNewMenu,
            list: presetsScriptsListMenu,
            apply: presetsScriptsApplyMenu,
            delete: presetsScriptsDeleteMenu,
            edit: presetsScriptsEditMenu,
        },
        tokens: {
            main: presetsTokensMenu,
            new: presetsTokensNewMenu,
            list: presetsTokensListMenu,
            delete: presetsTokensDeleteMenu,
            edit: presetsTokensEditMenu,
            prompts: {
                token: promptToken
            }
        }
    },
    settings: {
        main: settingsMenu,
        lang: settingsLangMenu,
    }
}