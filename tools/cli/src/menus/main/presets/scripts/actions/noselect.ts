import { divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { log } from "#utils/log.js";

export async function noSelect() {
    log.warn(uiMessage({
        "en-US": "No preset selected, back to scripts presets menu",
        "pt-BR": "Nenhuma predefinição selecionada, voltando ao menu de predefinições de scripts",
    }))
    divider();
    await menus.presets.scripts.main();
}