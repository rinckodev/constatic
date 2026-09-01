import { emojisDeleteMenu } from "./emojis/delete.js";
import { emojisFileMenu } from "./emojis/file.js";
import { emojisListMenu } from "./emojis/list.js";
import { emojisMenu } from "./emojis/menu.js";
import { emojisUploadMenu } from "./emojis/upload.js";
import { discordBotMenu } from "./main/discord/bot/menu.js";
import { mainMenu } from "./main/menu.js";
import { presetsMenu } from "./main/presets/menu.js";
import { presetsScriptsApplyMenu } from "./main/presets/scripts/menu-apply.js";
import { presetsScriptsDeleteMenu } from "./main/presets/scripts/menu-delete.js";
import { presetsScriptsEditMenu } from "./main/presets/scripts/menu-edit.js";
import { presetsScriptsListMenu } from "./main/presets/scripts/menu-list.js";
import { presetsScriptsNewMenu } from "./main/presets/scripts/menu-new.js";
import { scriptPresetsMenu } from "./main/presets/scripts/menu.js";
import { presetsTokensDeleteMenu } from "./main/presets/tokens/delete.js";
import { presetsTokensEditMenu } from "./main/presets/tokens/edit.js";
import { presetsTokensListMenu } from "./main/presets/tokens/list.js";
import { presetsTokensMenu } from "./main/presets/tokens/main.js";
import { presetsTokensNewMenu } from "./main/presets/tokens/new.js";
// import { settingsLangMenu } from "./main/settings/lang/menu.txt";
// import { settingsMenu } from "./main/settings/menu.txt";

export const menus = {
    main: mainMenu,
    emojis: {
        main: emojisMenu,
        list: emojisListMenu,
        file: emojisFileMenu,
        upload: emojisUploadMenu,
        delete: emojisDeleteMenu,
    },
    discord: {
        bot: discordBotMenu,
        // emojis: {
        //     main: discordEmojisMenu,
        //     list: discordEmojisListMenu,
        //     upload: discordEmojisUploadMenu,
        //     file: discordEmojisFileMenu,
        //     delete: discordEmojisDeleteMenu,
        //     select: selectDiscordBot,
        // },
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
        }
    },
    // settings: {
    //     main: settingsMenu,
    //     lang: settingsLangMenu,
    // }
}