import { log, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken, ProgramMenuProps } from "#types";
import ck from "chalk";
import { promptToken } from "./actions/prompt.js";

export async function presetsTokensNewMenu(props: ProgramMenuProps, tokens: DiscordBotToken[]) {
    const result = await promptToken(tokens);
    if (!result.success){
        log.error(result.error);
        await sleep(400);
        menus.presets.tokens.main(props);
        return;
    }
    const { name, invite, id, token } = result.data;
    
    tokens.push({ name, invite, id, token });

    props.conf.set("discord.bot.tokens", tokens);

    log.success(uiMessage({
       "en-US": "Token saved successfully!",
       "pt-BR": "Token salvo com sucesso!",
    }, ck.green));
    
    await sleep(400);
    menus.presets.tokens.main(props);
}