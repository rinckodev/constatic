import { BotProjectPreset } from "./project.js";

export interface BotLibDatabasePreset extends BotProjectPreset {
    isOrm: false;
    path: string;
}