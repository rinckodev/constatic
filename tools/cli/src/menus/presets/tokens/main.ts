import { commonTexts } from "#helpers";
import { menus } from "#menus";
import { program } from "#program";
import { prompts } from "#shared/prompts.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";

export async function presetsTokensMenu() {
    const action = await prompts.select({
        message: ck.reset.cyan.underline("❑ Manage tokens"),
        choices: [
            {
                name: ck.green("✦ New token"),
                value: "new"
            },
            {
                name: ck.blue("☰ List tokens"),
                value: "list"
            },
            {
                name: ck.yellowBright("✎ Edit token"),
                value: "edit"
            },
            {
                name: ck.red("✗ Delete tokens"),
                value: "delete"
            },
            {
                name: commonTexts.back,
                value: "back"
            },
        ]
    });
    console.log();

    const tokens = program.config.get("discord.bot.tokens", []);
    switch(action){
        case "back":{
            menus.main();
            return;
        }
        case "new": {
            menus.presets.tokens.new(tokens);
            return;
        }
    }

    if (!tokens.length){
        log.fail("No tokens to list");
        menus.presets.tokens.main();
        return;
    }

    switch (action) {
        case "list": {
            menus.presets.tokens.list(tokens);
            return;
        }
        case "edit": {
            menus.presets.tokens.edit(tokens);
            return;
        }
        case "delete": {
            menus.presets.tokens.delete(tokens);
            return;
        }
    }

}