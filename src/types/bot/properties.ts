import { BotAPIServerPreset } from "./apiServer.js";
import { BotOrmDatabasePreset } from "./dbOrm.js";
import { BotLibDatabasePreset } from "./dbPreset.js";

export type BotDatabasePreset = BotLibDatabasePreset | BotOrmDatabasePreset;

export interface BotTemplateProperties {
    dbpresets: BotDatabasePreset[];
    apiservers: BotAPIServerPreset[];
}