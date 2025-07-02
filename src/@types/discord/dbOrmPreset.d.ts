import { BotLibDatabasePreset } from "./dbPreset.js";
import { BotProjectPreset } from "./project.js";

export interface BotOrmDatabasePreset extends BotProjectPreset {
    isOrm: true;
    databases: BotLibDatabasePreset[];
}