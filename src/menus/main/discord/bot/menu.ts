import { byeMessage, cliTheme, commonTexts, divider, getCdPath, json, log, toNpmName, uiText } from "#helpers";
import { BotTemplateProperties, ProgramMenuProps } from "#types";
import { checkbox, input, select } from "@inquirer/prompts";
import ck from "chalk";
import lodash from "lodash";
import { cp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ora from "ora";
import { readPackageJSON } from "pkg-types";
import { copyProject } from "./copy.js";
import { rewriteEnv } from "./env.js";
import { installDeps } from "./install.js";

export async function discordBotMenu(props: ProgramMenuProps) {
    const templatePath = path.join(props.cliroot, "/templates/discord/bot");
    
    const displayCurrCwd = ck.dim.underline(path.basename(props.cwd)+"/");
    const projectpath = await input({
        message: uiText(props.lang, {
            "en-US": `📁 Project name ${displayCurrCwd}`,
            "pt-BR": `📁 Nome do projeto ${displayCurrCwd}`,
        }) + "\n",
        theme: cliTheme,
        async validate(projetpath) {
            const message = uiText(props.lang, {
                "en-US": `${projetpath} is not a valid path`,
                "pt-BR": `${projetpath} não é um caminho válido!`,
            });
            if (!projetpath){
                return message;
            }
            return true;
        },
        required: true,
        default: "./",
    });
    divider();

    const distpath = path.resolve(projectpath);
    const isDistRoot = distpath === props.cwd;

    const npmName = toNpmName(path.basename(isDistRoot ? distpath : projectpath));
    log.success(ck.bgBlue(` ${npmName} `));
    divider();

    const properties = await json
        .read<BotTemplateProperties>(path.join(templatePath, "properties.json"));

    const dbPresetIndex = await select({
        message: uiText(props.lang, {
           "en-US": "🧰 Database preset",
           "pt-BR": "🧰 Predefinição de banco de dados",
        }) + "\n",
        theme: cliTheme,
        choices: [
            { 
                name: uiText(props.lang, {
                   "en-US": "None",
                   "pt-BR": "Nenhum",
                }, ck.red.dim), value: -1 
            },
            properties.dbpresets
            .filter(preset => preset.disabled !== true)
            .map((preset, index) =>({
                name: `${preset.icon} ${preset.name} ${ck.dim(`(${preset.hint})`)}`,
                value: index,
            }))
        ].flat(),
    });
    divider();

    const dbPreset = properties.dbpresets[dbPresetIndex];

    const ormPresetIndex = dbPreset?.isOrm ? await select({
        message: uiText(props.lang, {
           "en-US": `${dbPreset.icon} Select ${dbPreset.name} database preset`,
           "pt-BR": `${dbPreset.icon} Selecione a predefinição de banco de dados ${dbPreset.name}`,
        }),
        theme: cliTheme,
        choices: [
            { 
                name: uiText(props.lang, {
                   "en-US": "None",
                   "pt-BR": "Nenhum",
                }, ck.red.dim), value: -1 
            },
            dbPreset.databases
            .filter(preset => preset.disabled !== true)
            .map((preset, index) =>({
                name: `${preset.icon} ${preset.name} ${ck.dim(`(${preset.hint})`)}`,
                value: index,
            }))
        ].flat(),
    }) : -1
    if (dbPreset?.isOrm) divider();

    const extraFeatures = await checkbox({
        message: [
            uiText(props.lang, {
                "en-US": "✨ Extra features",
                "pt-BR": "✨ Recursos extras",
            }),
            commonTexts(props.lang).instructions
        ].join("\n"),
        instructions: false,
        theme: {
            prefix: cliTheme.prefix,
            style: {
                renderSelectedChoices: () => "",
            }
        },
        choices: [
            { 
                name: uiText(props.lang, {
                   "en-US": "Discloud project",
                   "pt-BR": "Projeto discloud",
                }),
                value: "discloud",
                checked: true,  
            },
            { 
                name: uiText(props.lang, {
                   "en-US": "API Server",
                   "pt-BR": "Servidor de API",
                }), 
                value: "server" 
            },
        ],
        required: false,
    });
    divider();

    const apiServerIndex = extraFeatures.includes("server") 
    ? await select({
        message: uiText(props.lang, {
           "en-US": "🌐 API Server framework",
           "pt-BR": "🌐 Framework de Servidor de API",
        }),
        theme: cliTheme,
        choices: [
            properties.apiservers
            .filter(preset => preset.disabled !== true)
            .map((preset, index) =>({
                name: `${preset.icon} ${preset.name} ${ck.dim(`(${preset.hint})`)}`,
                value: index,
            }))
        ].flat(),
    }) : -1
    if (extraFeatures.includes("server")) divider();

    const tokens = props.conf.get("discord.bot.tokens", []);
    const tokenIndex = tokens.length >= 1
    ? await select({
        message: uiText(props.lang, {
           "en-US": "🔑 Saved token",
           "pt-BR": "🔑 Token salvo",
        }),
        theme: cliTheme,
        choices: [
            { 
                name: uiText(props.lang, {
                   "en-US": "None",
                   "pt-BR": "Nenhum",
                }, ck.red.dim), value: -1 
            },
            tokens
            .map((token, index) =>({
                name: `🤖 ${ck.yellow(token.name)}`,
                value: index,
            }))
        ].flat(),
    }) : -1
    divider();

    const manager = await select({
        message: uiText(props.lang, {
           "en-US": "📥 Install dependencies?",
           "pt-BR": "📥 Instalar dependências?",
        }),
        theme: cliTheme,
        choices: [
            ["npm", "yarn", "pnpm", "bun"]
            .map(manager =>({
                name: ck.green(manager),
                value: manager,
            })),
            { 
                name: uiText(props.lang, {
                   "en-US": "No",
                   "pt-BR": "Não",
                }, ck.red.dim), value: "no" 
            },
        ].flat(),
    });
    divider();
    
    const generating = ora();
    generating.start(uiText(props.lang, {
       "en-US": "The project is being generated! Please wait...",
       "pt-BR": "O projeto está sendo gerado! Aguarde...",
    }));

    await copyProject(path.join(templatePath, "project"), distpath);

    const packageJson = await readPackageJSON(path.join(distpath, "package.json"));
    lodash.set(packageJson, "name", npmName);

    if (dbPreset){
        generating.text = uiText(props.lang, {
           "en-US": "Setting up the database",
           "pt-BR": "Configurando o banco de dados",
        });

        const databasespath = path.join(templatePath, "databases");
        
        lodash.merge(packageJson, dbPreset.packageJson);
        if (dbPreset.env){
            await rewriteEnv(distpath, dbPreset.env);
        }
        if (dbPreset.isOrm){
            const ormPreset = dbPreset.databases[ormPresetIndex];
            lodash.merge(packageJson, ormPreset.packageJson);
            
            await cp(path.join(databasespath, ormPreset.path), distpath, {
                recursive: true, force: true,
            });
            if (ormPreset.env){
                await rewriteEnv(distpath, ormPreset.env);
            }
        } else {
            await cp(path.join(databasespath, dbPreset.path), distpath, {
                recursive: true, force: true,
            });
        }

    }

    if (apiServerIndex !== -1){
        generating.text = uiText(props.lang, {
            "en-US": "Setting up the API Server...",
            "pt-BR": "Configurando Servidor de API...",
        });

        const apiServersPath = path.join(templatePath, "extras/servers");
        const apiServerPreset = properties.apiservers[apiServerIndex];
        lodash.merge(packageJson, apiServerPreset.packageJson);
        if (apiServerPreset.env){
            await rewriteEnv(distpath, apiServerPreset.env);
        }
        await cp(path.join(apiServersPath, apiServerPreset.path), distpath, {
            recursive: true, force: true,
        });
    }

    const token = tokens[tokenIndex];
    if (token){
        generating.text = uiText(props.lang, {
            "en-US": "Writing the token to the .env file...",
            "pt-BR": "Escrevendo o token no arquivo .env...",
        });

        const envPath = path.join(distpath, ".env");
        const file = await readFile(envPath, "utf-8");
        const content = file.replace("BOT_TOKEN=", `BOT_TOKEN=${token.token}`);
        await writeFile(envPath, content, "utf-8");
    };
    const extraFeaturesPath = path.join(templatePath, "extras");

    await cp(
        path.join(extraFeaturesPath, "gitignore.txt"),
        path.join(distpath, ".gitignore")
    )
    if (extraFeatures.includes("discloud")){
        await cp(
            path.join(extraFeaturesPath, "discloud/discloudignore.txt"),
            path.join(distpath, ".discloudignore")
        )
        await cp(
            path.join(extraFeaturesPath, "discloud/discloudconfig.txt"),
            path.join(distpath, "discloud.config")
        )
    };

    await json.write(path.join(distpath, "package.json"), packageJson);

    if (manager !== "no"){
        await installDeps({ 
            lang: props.lang, distpath, 
            spinner: generating, 
            command: manager, 
        });
        divider();
    }
    generating.stop();
    
    log.success(uiText(props.lang, {
       "en-US": "Project generate successfully!",
       "pt-BR": "Projeto gerado com sucesso!",
    }));
    divider();

    if (!isDistRoot){
        log.custom(ck.green("➞"), uiText(props.lang, {
           "en-US": `Use: ${getCdPath(distpath)}`,
           "pt-BR": `Use: ${getCdPath(distpath)}`,
        }));
    }
    if (manager === "no"){
        log.custom(ck.green("➞"), uiText(props.lang, {
            "en-US": "Install the dependencies",
            "pt-BR": "Instale as dependências",
        }));
    }

    log.custom(ck.green("➞"), uiText(props.lang, {
        "en-US": `Run ${ck.underline("dev")} script`,
        "pt-BR": `Execute o script ${ck.underline("dev")}`,
    }));

    divider();
    console.log(byeMessage);
    divider();
}