import { log, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken } from "#types";
import ck from "chalk";
import { promptToken } from "./actions/prompt.js";
import { CLI } from "#cli";

export async function presetsTokensNewMenu(cli: CLI, tokens: DiscordBotToken[]) {
    const result = await promptToken(tokens);
    if (!result.success){
        log.error(result.error);
        await sleep(400);
        menus.presets.tokens.main(cli);
        return;
    }
    const { name, invite, id, token } = result.data;
    
    tokens.push({ name, invite, id, token });

    cli.config.set("discord.bot.tokens", tokens);

    log.success(uiMessage({
       "en-US": "Token saved successfully!",
       "pt-BR": "Token salvo com sucesso!",
    }, ck.green));
    
    await sleep(400);
    menus.presets.tokens.main(cli);
}