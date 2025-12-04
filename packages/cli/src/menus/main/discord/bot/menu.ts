import { divider, instructions, json, log, toNpmName, uiMessage } from "#helpers";
import { searchSelect, theme, withDefaults } from "../../../../helpers/prompts.js";
import { BotTemplateProperties } from "#types";
import { checkbox, input, select } from "@inquirer/prompts";
import ck from "chalk";
import path from "node:path";
import { CLI } from "#cli";
import { initBotAction } from "#actions/bot/init.js";

export async function discordBotMenu(cli: CLI) {
    const templatePath = path.join(cli.rootname, "/templates/discord/bot");

    const displayCurrCwd = ck.dim.underline(path.basename(process.cwd()) + "/");
    const projectPath = await input(withDefaults({
        message: uiMessage({
            "en-US": `📁 Project name ${displayCurrCwd}`,
            "pt-BR": `📁 Nome do projeto ${displayCurrCwd}`,
        }) + "\n",
        async validate(projetpath) {
            const message = uiMessage({
                "en-US": `${projetpath} is not a valid path`,
                "pt-BR": `${projetpath} não é um caminho válido!`,
            });
            if (!projetpath) {
                return message;
            }
            return true;
        },
        required: true,
        default: "./",
    }));
    divider();

    const distPath = path.resolve(projectPath);
    const isDistRoot = distPath === process.cwd();

    const npmName = toNpmName(path.basename(isDistRoot ? distPath : projectPath));
    log.success(ck.bgBlue(` ${npmName} `));
    divider();

    const properties = await json
        .read<BotTemplateProperties>(path.join(templatePath, "properties.json"));

    const database = await select(withDefaults({
        message: uiMessage({
            "en-US": "🧰 Database preset",
            "pt-BR": "🧰 Predefinição de banco de dados",
        }),
        loop: false,
        choices: [
            {
                name: uiMessage({
                    "en-US": "None",
                    "pt-BR": "Nenhum",
                }, ck.red.dim), value: undefined
            },
            ...Object.entries(properties.presets.databases)
                .filter(([_, preset]) => preset.disabled !== true)
                .map(([value, preset]) => ({
                    name: `${preset.icon} ${preset.name} ${ck.dim(`(${preset.hint})`)}`,
                    value, description: preset.hint
                }))
        ],
    }));
    divider();

    const extras = await checkbox(withDefaults({
        message: uiMessage({
            "en-US": "✨ Extra features",
            "pt-BR": "✨ Recursos extras",
        }),
        choices: [
            {
                name: uiMessage({
                    "en-US": "🗐 Discloud files",
                    "pt-BR": "🗐 Arquivos Discloud",
                }, ck.greenBright),
                value: "discloud",
                checked: true,
            },
            {
                name: uiMessage({
                    "en-US": "◍ API Server",
                    "pt-BR": "◍ Servidor de API",
                }, ck.cyanBright),
                value: "server"
            },
            {
                name: uiMessage({
                    "en-US": "🗲 Tsup compiler",
                    "pt-BR": "🗲 Compilador tsup",
                }, ck.blueBright),
                value: "tsup"
            },
        ] as const,
        instructions: instructions.checkbox,
        required: false,
    }));
    divider();

    const server = extras.includes("server")
        ? await select(withDefaults({
            message: uiMessage({
                "en-US": "🌐 API Server",
                "pt-BR": "🌐 Servidor de API",
            }),
            choices: [
                ...Object.entries(properties.presets.servers)
                    .filter(([_, preset]) => preset.disabled !== true)
                    .map(([value, preset]) => ({
                        name: `${preset.icon} ${preset.name} ${ck.dim(`(${preset.hint})`)}`,
                        value,
                    }))
            ],
        }))
        : undefined
    if (extras.includes("server")) divider();

    const tokens = cli.config.get("discord.bot.tokens", []);
    const token = tokens.length >= 1
        ? await select(withDefaults({
            message: uiMessage({
                "en-US": "🔑 Saved token",
                "pt-BR": "🔑 Token salvo",
            }),
            choices: [
                {
                    name: uiMessage({
                        "en-US": "None",
                        "pt-BR": "Nenhum",
                    }, ck.red.dim), value: ""
                },
                ...tokens
                    .map(token => ({
                        name: `🤖 ${ck.yellow(token.name)}`,
                        value: token.name,
                    }))
            ],
        }))
        : undefined
    divider();

    const scripts = cli.config.get("presets.scripts", []);
    const selectedScripts = scripts.length < 1 ? [] : await searchSelect(withDefaults({
        message: uiMessage({
            "en-US": "🗐 Script presets",
            "pt-BR": "🗐 Predefinições de scripts",
        }),
        options: scripts.map(script => ({
            name: script.name,
            value: script.name,
        })),
        theme: theme.searchSelect,
        instructions: instructions.searchSelect,
    }));
    if (scripts.length >= 1) divider();

    const managerSuffix = ck.bgWhite(` ${cli.shell.agent} `);

    const install = await select(withDefaults({
        message: uiMessage({
            "en-US": `📥 Install dependencies? ${managerSuffix}`,
            "pt-BR": `📥 Instalar dependências? ${managerSuffix}`,
        }),
        choices: [
            {
                name: uiMessage({
                    "en-US": "Yes",
                    "pt-BR": "Sim",
                }, ck.greenBright), value: "yes"
            },
            {
                name: uiMessage({
                    "en-US": "No",
                    "pt-BR": "Não",
                }, ck.redBright), value: "no"
            },
        ]
    })) == "yes";
    divider();

    await initBotAction(cli, {
        dist: distPath,
        database, 
        extras, 
        server,
        install,
        token, 
        scripts: selectedScripts,
    });
}