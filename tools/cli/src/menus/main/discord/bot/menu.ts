import { initBotAction } from "#actions/bot/init.js";
import { instructions, json, toNpmName } from "#helpers";
import { program } from "#program";
import { BotTemplateProperties } from "#types";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { checkbox, input, select } from "@inquirer/prompts";
import path from "node:path";
import { searchSelect, theme, withDefaults } from "../../../../helpers/prompts.js";

export async function discordBotMenu() {
    const templatePath = program.templates.path;

    const displayCurrCwd = ck.dim.underline(path.basename(process.cwd()) + "/");
    const projectPath = await input(withDefaults({
        message: `📁 Project name ${displayCurrCwd}"\n"`,
        async validate(projetpath) {
            if (!projetpath) {
                return `${projetpath} is not a valid path`;
            }
            return true;
        },
        required: true,
        default: "./",
    }));
    console.log();

    const distPath = path.resolve(projectPath);
    const isDistRoot = distPath === process.cwd();

    const npmName = toNpmName(path.basename(isDistRoot ? distPath : projectPath));
    log.success(ck.bgBlue(` ${npmName} `));
    console.log();

    const properties = await json
        .read<BotTemplateProperties>(path.join(templatePath, "properties.json"));

    const database = await select(withDefaults({
        message: "🧰 Database preset",
        loop: false,
        choices: [
            {
                name: ck.red.dim("None"), 
                value: undefined
            },
            ...Object.entries(properties.presets.databases)
                .filter(([_, preset]) => preset.disabled !== true)
                .map(([value, preset]) => ({
                    name: `${preset.icon} ${preset.name} ${ck.dim(`(${preset.hint})`)}`,
                    value, description: preset.hint
                }))
        ],
    }));
    console.log();

    const extras = await checkbox(withDefaults({
        message: "✨ Extra features",
        choices: [
            {
                name: ck.greenBright("🗐 Discloud files"),
                value: "discloud",
                checked: true,
            },
            {
                name: ck.cyanBright("◍ API Server"),
                value: "server"
            },
            {
                name: ck.blueBright("🗲 Tsup compiler"),
                value: "tsup"
            },
        ] as const,
        instructions: instructions.checkbox,
        required: false,
    }));
    console.log();

    const server = extras.includes("server")
        ? await select(withDefaults({
            message: "🌐 API Server",
            choices: Object.entries(properties.presets.servers)
                .filter(([_, preset]) => preset.disabled !== true)
                .map(([value, preset]) => ({
                    name: `${preset.icon} ${preset.name} ${ck.dim(`(${preset.hint})`)}`,
                    value,
                }))
        }))
        : undefined
    if (extras.includes("server")) console.log();

    const tokens = program.config.get("discord.bot.tokens", []);
    const token = tokens.length >= 1
        ? await select(withDefaults({
            message: "🔑 Saved token",
            choices: [
                {
                    name: ck.red.dim("None"), 
                    value: ""
                },
                ...tokens.map(token => ({
                    name: `🤖 ${ck.yellow(token.name)}`,
                    value: token.name,
                }))
            ],
        }))
        : undefined
    console.log();

    const scripts = program.config.get("presets.scripts", []);
    const selectedScripts = scripts.length < 1 ? [] : await searchSelect(withDefaults({
        message: "🗐 Script presets",
        options: scripts.map(script => ({
            name: script.name,
            value: script.name,
        })),
        theme: theme.searchSelect,
        instructions: instructions.searchSelect,
    }));
    if (scripts.length >= 1) console.log();

    const managerSuffix = ck.bgWhite(` ${program.runtime.agent()} `);

    const install = await select(withDefaults({
        message: `📥 Install dependencies? ${managerSuffix}`,
        choices: [
            {
                name: ck.greenBright("Yes"), 
                value: true
            },
            {
                name: ck.redBright("no"), 
                value: false
            },
        ]
    }));
    console.log();

    await initBotAction({
        dist: distPath,
        database, 
        extras, 
        server,
        install,
        token, 
        scripts: selectedScripts,
    });
}