import { cliTheme, commonTexts, discordEmojis, divider, log, sleep, uiText } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken, ProgramMenuProps } from "#types";
import { checkbox, confirm } from "@inquirer/prompts";
import ck from "chalk";
import { fetchDiscordEmojis } from "./fetch.js";
import ora from "ora";

export async function discordEmojisDeleteMenu(props: ProgramMenuProps, token: DiscordBotToken) {
    const emojis = await fetchDiscordEmojis({ props, token });
    if (!emojis) return;

    const choices = emojis.map((emoji, index) => ({
        name: [
            emoji.animated ? ck.magenta("(animated)") : ck.cyan("(static)"),
            ck.yellow(emoji.name),
            ck.dim.green(emoji.id)
        ].join(" "),
        value: index,
    }));

    const selected = await checkbox({
        message: [
            uiText(props.lang, {
                "en-US": "Select the emojis you want to delete",
                "pt-BR": "Selecione os emojis que deseja deletar",
            }),
            commonTexts(props.lang).instructions
        ].join("\n"),
        theme: {
            prefix: cliTheme.prefix,
            style: {
                renderSelectedChoices: () => "",
            }
        },
        instructions: false,
        pageSize: 10,
        choices,
    });
    divider();

    if (selected.length < 1){
        log.warn(uiText(props.lang, {
           "en-US": "No emoji selected, back to emojis menu",
           "pt-BR": "Nenhum emoji selecionado, voltando ao menu de emojis",
        }));
        await sleep(500);
        menus.discord.emojis.main(props);
        return;
    }

    const amountText = ck.underline(`${selected.length} emoji${selected.length > 1 ? "s" : ""}`);

    log.warn(uiText(props.lang, {
        "en-US": `You are about to delete ${amountText}!`,
        "pt-BR": `Você está prestes a excluir ${amountText}!`,
    }));

    const proceed = await confirm({
        message: uiText(props.lang, {
            "en-US": `Do you want to continue?`,
            "pt-BR": `Deseja continuar?`,
        }),
        theme: cliTheme
    });

    if (!proceed) {
        menus.discord.emojis.main(props, token);
        return;
    }

    for (const index of selected) {
        const emoji = emojis[index];
        const name = ck.yellow.underline(emoji.name);
        const deleting = ora();
        deleting.start(uiText(props.lang, {
            "en-US": `Deleting ${emoji.name}...`,
            "pt-BR": `Excluindo ${emoji.name}...`
        }));

        const result = await discordEmojis.delete(token, emoji.id);
        deleting.stop();

        if (!result.success) {
            log.error(uiText(props.lang, {
                "en-US": `An error occurred while trying delete the emoji ${name}!`,
                "pt-BR": `Ocorreu um erro ao tentar excluir o emoji ${name}!`
            }, ck.red));
            continue;
        }
        log.success(uiText(props.lang, {
            "en-US": `${ck.bgRed.white(" Deleted ")} Emoji ${name} deleted successfully!`,
            "pt-BR": `${ck.bgRed.white(" Excluído ")} Emoji ${name} excluído com sucesso!`
        }, ck.green));
    }
    
    divider();
    log.success(uiText(props.lang, {
        "en-US": "Deleting process completed!",
        "pt-BR": "Processo de exclusão concluído!",
    }, ck.green));
    divider();

    await sleep(500);

    menus.discord.emojis.main(props, token);
}

