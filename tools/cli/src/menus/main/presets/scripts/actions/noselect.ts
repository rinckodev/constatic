import { CLI } from "#cli";
import { divider, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import { log } from "#utils/log.js";

export async function noSelect(cli: CLI) {
    log.warn(uiMessage({
        "en-US": "No preset selected, back to scripts presets menu",
        "pt-BR": "Nenhuma predefinição selecionada, voltando ao menu de predefinições de scripts",
    }))
    divider();
    await sleep(400);
    menus.presets.scripts.main(cli);
}