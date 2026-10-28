import { actions } from "#actions/index.js";
import { sleep } from "#helpers";
import { menus } from "#menus";
import { ScriptPreset } from "#program";

export async function presetsScriptsListMenu(presets: ScriptPreset[]) {
    await actions.scripts.list(presets);
    await sleep(400);
    await menus.presets.scripts.main();
}