import { menus } from "#menus";
import { log } from "#utils/log.js";

export async function noSelect() {
    log.warn("No preset selected, back to scripts presets menu")
    console.log();
    await menus.presets.scripts.main();
}