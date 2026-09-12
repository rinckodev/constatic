import { sleep } from "#helpers";
import { menus } from "#menus";
import { program } from "#program";
import { DiscordBotToken } from "#shared/token.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { promptToken } from "./prompt.js";

export async function presetsTokensNewMenu(tokens: DiscordBotToken[]) {
    const result = await promptToken(tokens);
    if (!result.success){
        log.error(result.error);
        menus.presets.tokens.main();
        return;
    }
    const { name, id, token } = result.data;
    
    tokens.push({ name, id, token });

    program.config.set("discord.bot.tokens", tokens);

    log.success(ck.green("Token saved successfully!"));
    
    await sleep(400);
    menus.presets.tokens.main();
}