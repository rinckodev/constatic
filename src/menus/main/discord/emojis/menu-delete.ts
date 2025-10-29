import { discordEmojis, divider, log, sleep, uiMessage, withDefaults } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken } from "#types";
import { checkbox, confirm } from "@inquirer/prompts";
import ck from "chalk";
import ora from "ora";
import { CLI } from "#cli";
import { fetchDiscordEmojis } from "#shared/emojis/fetch.js";

export async function discordEmojisDeleteMenu(cli: CLI, token: DiscordBotToken) {
    const emojis = await fetchDiscordEmojis({ cli, token });
    if (!emojis) return;

    const choices = emojis.map((emoji, index) => ({
        name: [
            emoji.animated ? ck.magenta("(animated)") : ck.cyan("(static)"),
            ck.yellow(emoji.name),
            ck.dim.green(emoji.id)
        ].join(" "),
        value: index,
    }));

    const selected = await checkbox(withDefaults({
        message: uiMessage({
            "en-US": "Select the emojis you want to delete",
            "pt-BR": "Selecione os emojis que deseja deletar",
        }),
        pageSize: 10,
        choices,
    }));
    divider();

    if (selected.length < 1){
        log.warn(uiMessage({
           "en-US": "No emoji selected, back to emojis menu",
           "pt-BR": "Nenhum emoji selecionado, voltando ao menu de emojis",
        }));
        await sleep(500);
        menus.discord.emojis.main(cli);
        return;
    }

    const amountText = ck.underline(`${selected.length} emoji${selected.length > 1 ? "s" : ""}`);

    log.warn(uiMessage({
        "en-US": `You are about to delete ${amountText}!`,
        "pt-BR": `Você está prestes a excluir ${amountText}!`,
    }));

    const proceed = await confirm(withDefaults({
        message: uiMessage({
            "en-US": `Do you want to continue?`,
            "pt-BR": `Deseja continuar?`,
        })
    }));

    if (!proceed) {
        menus.discord.emojis.main(cli, token);
        return;
    }

    const promises: Promise<void>[] = [];

    const deleting = ora();
    deleting.start(uiMessage({
        "en-US": `Preparing to delete emojis...`,
        "pt-BR": `Preparando para excluir emojis...`
    }));

    for (const index of selected) {
        const emoji = emojis[index];
        const name = ck.yellow.underline(emoji.name);
        

        const promise = discordEmojis.delete(token, emoji.id)
        .then(result => {
            if (!result.success) {
                log.error(uiMessage({
                    "en-US": `An error occurred while trying delete the emoji ${name}!`,
                    "pt-BR": `Ocorreu um erro ao tentar excluir o emoji ${name}!`
                }, ck.red));
            }
            log.custom(ck.red(log.icon.success), uiMessage({
                "en-US": `${ck.red.bold("Deleted")} → ${name}`,
                "pt-BR": `${ck.bgRed.bold("Excluído")} → ${name}`
            }));
        })

        promises.push(promise);
    }
    deleting.stop();

    await Promise.all(promises);
    
    divider();
    log.success(uiMessage({
        "en-US": "Deleting process completed!",
        "pt-BR": "Processo de exclusão concluído!",
    }, ck.green));
    divider();

    await sleep(500);

    menus.discord.emojis.main(cli, token);
}

