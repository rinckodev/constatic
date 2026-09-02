import { commonTexts } from "#helpers";
import { menus } from "#menus";
import { program } from "#program";
import { DiscordBotToken } from "#shared/token.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { select } from "@inquirer/prompts";
import { withDefaults } from "../../../../helpers/prompts.js";
import { promptToken } from "./prompt.js";

export async function presetsTokensEditMenu(tokens: DiscordBotToken[]) {
    const choices = tokens.map(token => ({
        name: `🤖 ${ck.yellow.underline(token.name)}`,
        value: token.id
    }));

    choices.unshift({
        name: commonTexts.back,
        value: "back",
    })

    const selected = await select(withDefaults({
        message: "Select the token you want to edit",
        choices,
    }));
    console.log();


    if (selected === "back") {
        menus.presets.tokens.main();
        return;
    }

    const result = await promptToken(tokens);
    if (!result.success) {
        log.error(result.error);
        await menus.presets.tokens.main();
        return;
    }

    const index = tokens.findIndex(data => data.id === selected);
    tokens[index] = result.data;

    program.config.set("discord.bot.tokens", tokens);

    log.success(ck.green("Token edited successfully!"));
    await menus.presets.tokens.main();
}