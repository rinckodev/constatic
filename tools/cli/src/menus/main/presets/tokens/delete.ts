import { menus } from "#menus";
import { program } from "#program";
import { prompts } from "#shared/prompts.js";
import { DiscordBotToken } from "#shared/token.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";

export async function presetsTokensDeleteMenu(tokens: DiscordBotToken[]) {
    const choices = tokens.map(t => ({
        name: `🤖 ${ck.yellow.underline(t.name)}`, value: t.id
    }));

    const selected = await prompts.checkbox({
        message: "Select the tokens you want to delete",
        choices,
        required: false,
    });
    console.log();


    if (selected.length < 1){
        log.warn("No token selected, back to tokens menu")
        console.log();
        await menus.presets.tokens.main();
        return;
    }

    program.config.set("discord.bot.tokens", 
        tokens.filter(t => !selected.includes(t.id))
    );

    log.success(ck.green("Selected tokens removed successfully!"));
    console.log();

    await menus.presets.tokens.main();
}