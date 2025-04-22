import { byeMessage, cliTheme, commonTexts, divider, getCdPath, getPackageManager, json, log, toNpmName, uiText } from "#helpers";
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
        }),
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
           "en-US": `Select ${dbPreset.name} database preset ${dbPreset.icon} `,
           "pt-BR": `Selecione a predefinição de banco de dados ${dbPreset.name} ${dbPreset.icon} `,
        }),
        theme: cliTheme,
        choices: dbPreset.databases
        .filter(preset => preset.disabled !== true)
        .map((preset, index) =>({
            name: `${preset.icon} ${preset.name} ${ck.dim(`(${preset.hint})`)}`,
            value: index,
        }))
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
                renderSelectedChoices: () => ""
            }
        },
        choices: [
            { 
                name: uiText(props.lang, {
                   "en-US": "🗐 Discloud files",
                   "pt-BR": "🗐 Arquivos Discloud",
                }, ck.greenBright),
                value: "discloud",
                checked: true,  
            },
            { 
                name: uiText(props.lang, {
                   "en-US": "◍ API Server",
                   "pt-BR": "◍ Servidor de API",
                }, ck.cyanBright), 
                value: "server" 
            },
            { 
                name: uiText(props.lang, {
                   "en-US": "🗲 Tsup compiler",
                   "pt-BR": "🗲 Compilador tsup",
                }, ck.blueBright),
                value: "tsup" 
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

    const manager = getPackageManager();

    // const installAllDeps = await confirm({
    //     message: uiText(props.lang, {
    //         "en-US": `📥 Install dependencies? ${ck.underline.dim(manager)} detected!`,
    //         "pt-BR": `📥 Instalar dependências? ${ck.underline.dim(manager)} detectado!`,
    //     }),
    //     theme: cliTheme,
    // });
    // divider();

    const managerSuffix = ck.bgWhite(` ${manager} `);

    const installAllDeps = await select({
        message: uiText(props.lang, {
           "en-US": `📥 Install dependencies? ${managerSuffix}`,
           "pt-BR": `📥 Instalar dependências? ${managerSuffix}`,
        }),
        theme: cliTheme,
        choices: [
            { 
                name: uiText(props.lang, {
                   "en-US": "Yes",
                   "pt-BR": "Sim",
                }, ck.greenBright), value: "yes" 
            },
            { 
                name: uiText(props.lang, {
                   "en-US": "No",
                   "pt-BR": "Não",
                }, ck.redBright), value: "no" 
            },
        ]
    }) == "yes";
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
        const folder = props.isBun ? "bun" : "discloud"
        await cp(
            path.join(extraFeaturesPath, 
                `${folder}/discloud.ignore.txt`),
            path.join(distpath, ".discloudignore")
        )
        await cp(
            path.join(extraFeaturesPath, `${folder}/discloud.config.txt`),
            path.join(distpath, "discloud.config")
        )
        if (props.isBun){
            await cp(
                path.join(extraFeaturesPath, "bun/Dockerfile"),
                path.join(distpath, "Dockerfile")
            ) 
        }
    };
    if (extraFeatures.includes("tsup")){
        const tsupPackageJson = await readPackageJSON(
            path.join(extraFeaturesPath, "tsup/package.json")
        );

        lodash.merge(packageJson, tsupPackageJson);

        await cp(
            path.join(extraFeaturesPath, "tsup/tsup.config.ts"),
            path.join(distpath, "tsup.config.ts")
        )
    }

    const baseVersionPath = path.join(distpath, "src/discord/base/base.version.ts");
    await readFile(baseVersionPath, "utf-8")
    .then(content => content.replace("{{baseVersion}}", props.version))
    .then(content => writeFile(baseVersionPath, content, "utf-8"))

    packageJson.baseVersion = props.version;

    if (props.isBun){
        const bunPkgJson = await readPackageJSON(
            path.join(extraFeaturesPath, "bun/package.json")
        );
        lodash.merge(packageJson, bunPkgJson);
        packageJson.devDependencies = lodash.omit(
            packageJson.devDependencies,
            "@types/node", "tsx"
        );
    }

    await json.write(path.join(distpath, "package.json"), packageJson);

    if (installAllDeps){
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
    if (!installAllDeps){
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