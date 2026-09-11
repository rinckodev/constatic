import { initBotAction } from "#actions/bot/init.js";
import { instructions, json, searchSelect, theme } from "#helpers";
import { type BotTemplateProperties, program } from "#program";
import { toNpmName } from "#shared/npm.js";
import { prompts } from "#shared/prompts.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import path from "node:path";

export async function discordBotMenu() {
    const templatePath = program.templates.path;

    const displayCurrCwd = ck.dim.underline(path.basename(process.cwd()) + "/");
    const projectPath = await prompts.input({
        message: `📁 Project name ${displayCurrCwd}\n`,
        async validate(projetpath) {
            if (!projetpath) {
                return `${projetpath} is not a valid path`;
            }
            return true;
        },
        required: true,
        default: "./",
    });
    console.log();

    const distPath = path.resolve(projectPath);
    const isDistRoot = distPath === process.cwd();

    const npmName = toNpmName(path.basename(isDistRoot ? distPath : projectPath));
    log.success(ck.bgBlue(` ${npmName} `));
    console.log();

    const properties = await json
        .read<BotTemplateProperties>(path.join(templatePath, "properties.json"));

    const database = await prompts.select({
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
    });
    console.log();

    const extras = await prompts.checkbox({
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
        // instructions: instructions.checkbox, // TODO
        required: false,
    });
    console.log();

    const server = extras.includes("server")
        ? await prompts.select({
            message: "🌐 API Server",
            choices: Object.entries(properties.presets.servers)
                .filter(([_, preset]) => preset.disabled !== true)
                .map(([value, preset]) => ({
                    name: `${preset.icon} ${preset.name} ${ck.dim(`(${preset.hint})`)}`,
                    value,
                }))
        })
        : undefined
    if (extras.includes("server")) console.log();

    const tokens = program.config.get("discord.bot.tokens", []);
    const token = tokens.length >= 1
        ? await prompts.select({
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
        })
        : undefined
    console.log();

    const scripts = program.config.get("presets.scripts", []);
    const selectedScripts = scripts.length < 1 ? [] : await searchSelect({
        message: "🗐 Script presets",
        options: scripts.map(script => ({
            name: script.name,
            value: script.name,
        })),
        theme: theme.searchSelect,
        instructions: instructions.searchSelect,
    }); // TODO
    if (scripts.length >= 1) console.log();

    const managerSuffix = ck.bgWhite(` ${program.runtime.agent()} `);

    const install = await prompts.select({
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
    });
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