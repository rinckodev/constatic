import { program } from "#program";
import { ck } from "#utils/ck.js";
import { Result } from "#utils/result.js";
import { password, select } from "@inquirer/prompts";
import { KeyValueFile } from "../../lib/kvf.js";
import { fetchToken } from "../../shared/token.js";

export async function selectBotMenu() {
    const tokens = program.config.get("discord.bot.tokens", []);

    const paths = await program.fs.glob("./.env*");

    const envs = (
        await Promise.allSettled(paths.map(async filepath => {
            const env = new KeyValueFile(filepath);
            await env.read();
            return { name: filepath, vars: env.record }
        }))
    )
        .filter(s => s.status === "fulfilled")
        .filter(s => 
            "BOT_TOKEN" in s.value.vars &&
            !!s.value.vars.BOT_TOKEN
        )
        .map(s => s.value);
    
    const choices: { name: string, value: any }[] = tokens.map((token, index) => ({
        name: `${ck.green("●")} ${ck.blue(token.name)}`,
        value: index,
    }));

    choices.unshift(
            ...envs.map(data => ({
            name: ck.yellow(`▲ Use ${ck.underline(data.name)} file BOT_TOKEN`),
            value: data.vars.BOT_TOKEN
        })),
        {
            name: ck.green("✦ New temporary application"),
            value: -2
        },
    );
    choices.push({
        name: ck.gray("⤶ Back"),
        value: -1
    });

    const index = await select({
        message: "Select an bot application",
        choices,
    });

    if (typeof index === "string"){
        return fetchToken(index);
    }
    if (index === -1){
        return Result.fail("back");
    }
    if (index === -2){
        const token = await password({
            message: "Insert your bot application token",
        });
        const existing = tokens.find(t => t.token === token);
        if (existing) return Result.fail(
            `This token is already saved! 🤖 ${ck.yellow.underline(existing.name)}`
        );
        return fetchToken(token);
    }
    return Result.ok(tokens[index])
}