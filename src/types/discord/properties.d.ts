import { BotAPIServerPreset } from "./apiServerPreset.js";
import { BotOrmDatabasePreset } from "./dbOrmPreset.js";
import { BotLibDatabasePreset } from "./dbPreset.js";

export type BotDatabasePreset = BotLibDatabasePreset | BotOrmDatabasePreset;

export interface BotTemplateProperties {
    dbpresets: BotDatabasePreset[];
    apiservers: BotAPIServerPreset[];
}