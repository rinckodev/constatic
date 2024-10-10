import { botMenu } from "./bot/menu.js";
import { mainMenu } from "./main/menu.js";
import { settingsMenu } from "./settings/menu.js";
import { tokenSettingsMenu } from "./settings/tokens/menu.js";

export const menus = {
    main: mainMenu,
    bot: botMenu,
    settings: {
        main: settingsMenu,
        tokens: tokenSettingsMenu
    }
};