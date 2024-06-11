import { botMenus } from "./bot/index.js";
import { programMenus } from "./program/index.js";
import { settingsMenus } from "./settings/index.js";

export const menus = {
    program: programMenus,
    bot: botMenus,
    settings: settingsMenus
}