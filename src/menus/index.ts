import { discordbotMenus } from "./discordbot/index.js";
import { programMenus } from "./program/index.js";
import { settingsMenus } from "./settings/index.js";

export const menus = {
    program: programMenus,
    settings: settingsMenus,
    discordbot: discordbotMenus
};