import { discordBotMenu } from "./bot/menu.js";
import { emojisClearMenu } from "./emojis/clear.js";
import { emojisDeleteMenu } from "./emojis/delete.js";
import { emojisFileMenu } from "./emojis/file.js";
import { emojisListMenu } from "./emojis/list.js";
import { emojisMenu } from "./emojis/menu.js";
import { emojisUploadMenu } from "./emojis/upload.js";
import { mainMenu } from "./main.js";
import { presetsMenu } from "./presets/menu.js";
import { presetsScriptsApplyMenu } from "./presets/scripts/apply.js";
import { presetsScriptsDeleteMenu } from "./presets/scripts/delete.js";
import { presetsScriptsEditMenu } from "./presets/scripts/edit.js";
import { presetsScriptsListMenu } from "./presets/scripts/list.js";
import { scriptPresetsMenu } from "./presets/scripts/menu.js";
import { presetsScriptsNewMenu } from "./presets/scripts/new.js";
import { presetsTokensDeleteMenu } from "./presets/tokens/delete.js";
import { presetsTokensEditMenu } from "./presets/tokens/edit.js";
import { presetsTokensListMenu } from "./presets/tokens/list.js";
import { presetsTokensMenu } from "./presets/tokens/main.js";
import { presetsTokensNewMenu } from "./presets/tokens/new.js";

export const menus = Object.freeze({
    main: mainMenu,
    emojis: {
        main: emojisMenu,
        list: emojisListMenu,
        file: emojisFileMenu,
        upload: emojisUploadMenu,
        delete: emojisDeleteMenu,
        clear: emojisClearMenu,
    },
    bot: {
        init: discordBotMenu
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
    }
});