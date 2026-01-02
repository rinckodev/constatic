import { CLI } from "#cli";
import { uiMessage, divider, sleep, log } from "#helpers";
import { menus } from "#menus";

export async function noSelect(cli: CLI) {
    log.warn(uiMessage({
        "en-US": "No preset selected, back to scripts presets menu",
        "pt-BR": "Nenhuma predefinição selecionada, voltando ao menu de predefinições de scripts",
    }))
    divider();
    await sleep(400);
    menus.presets.scripts.main(cli);
}