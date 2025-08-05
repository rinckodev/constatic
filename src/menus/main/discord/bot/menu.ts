import { byeMessage, copy, createEnvEditor, divider, getCdPath, getPackageManager, instructions, json, log, toNpmName, uiMessage } from "#helpers";
import { searchSelect, theme, withDefaults } from "#prompts";
import { applyScriptPresets } from "#shared/presets/scripts/apply.js";
import { BotTemplateProperties, ProgramMenuProps } from "#types";
import { checkbox, input, select } from "@inquirer/prompts";
import ck from "chalk";
import merge from "lodash.merge";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ora from "ora";
import { readPackageJSON } from "pkg-types";
import { Project } from "ts-morph";
import { copyProject } from "./copy.js";
import { updateEnv } from "./env.js";
import { installDeps } from "./install.js";

export async function discordBotMenu(props: ProgramMenuProps) {
    const templatePath = path.join(props.cliroot, "/templates/discord/bot");
    
    const displayCurrCwd = ck.dim.underline(path.basename(props.cwd)+"/");
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
            if (!projetpath){
                return message;
            }
            return true;
        },
        required: true,
        default: "./",
    }));
    divider();

    const distPath = path.resolve(projectPath);
    const isDistRoot = distPath === props.cwd;

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
        choices: [
            { 
                name: uiMessage({
                   "en-US": "None",
                   "pt-BR": "Nenhum",
                }, ck.red.dim), value: undefined 
            },
            ...Object.values(properties.presets.databases)
            .filter(preset => preset.disabled !== true)
            .map(preset => ({
                name: `${preset.icon} ${preset.name} ${ck.dim(`(${preset.hint})`)}`,
                value: preset,
            }))
        ],
    }));
    divider();

    const orm = database?.isORM ? await select(withDefaults({
        message: uiMessage({
           "en-US": `Select ${database.name} database preset ${database.icon} `,
           "pt-BR": `Selecione a predefinição de banco de dados ${database.name} ${database.icon} `,
        }),
        choices: Object.values(database.databases)
        .filter(preset => preset.disabled !== true)
        .map((preset) =>({
            name: `${preset.icon} ${preset.name} ${ck.dim(`(${preset.hint})`)}`,
            value: preset,
        }))
    })) : undefined
    if (orm) divider();

    const extraFeatures = await checkbox(withDefaults({
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

    const server = extraFeatures.includes("server") 
        ? await select(withDefaults({
            message: uiMessage({
            "en-US": "🌐 API Server",
            "pt-BR": "🌐 Servidor de API",
            }),
            choices: [
                ...Object.values(properties.presets.servers)
                .filter(preset => preset.disabled !== true)
                .map(preset =>({
                    name: `${preset.icon} ${preset.name} ${ck.dim(`(${preset.hint})`)}`,
                    value: preset,
                }))
            ],
        })) 
        : undefined
    if (extraFeatures.includes("server")) divider();

    const tokens = props.conf.get("discord.bot.tokens", []);
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
                .map(token =>({
                    name: `🤖 ${ck.yellow(token.name)}`,
                    value: token.token,
                }))
            ],
        })) 
        : undefined
    divider();

    const scripts = props.conf.get("presets.scripts", []);
    const selectedScripts = scripts.length < 1 ? [] : await searchSelect(withDefaults({
        message: uiMessage({
           "en-US": "🗐 Script presets",
           "pt-BR": "🗐 Predefinições de scripts",
        }),
        options: scripts.map(script => ({
            name: script.name,
            value: script,
        })),
        theme: theme.searchSelect,
        instructions: instructions.searchSelect,
    }));
    if (scripts.length >= 1) divider();

    const manager = getPackageManager();

    const managerSuffix = ck.bgWhite(` ${manager} `);

    const installAllDeps = await select(withDefaults({
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
    
    const generating = ora();
    generating.start(uiMessage({
       "en-US": "The project is being generated! Please wait...",
       "pt-BR": "O projeto está sendo gerado! Aguarde...",
    }));

    const resolveDistPath = (...paths: string[]) => path.join(distPath, ...paths);

    await copyProject(path.join(templatePath, "project"), distPath);

    const project = new Project({
        tsConfigFilePath: resolveDistPath("tsconfig.json"),
    });

    generating.text = uiMessage({
        "en-US": "Creating environment variables editor",
        "pt-BR": "Criando editor de variáveis de ambiente",
    });

    const envEditor = await createEnvEditor(path.join(distPath, ".env"));
    const projectFiles = {
        envSchema: project.addSourceFileAtPath(
            resolveDistPath("src/env.ts")
        ),
        index: project.addSourceFileAtPath(
            resolveDistPath("src/index.ts")
        ),
    }


    generating.text = uiMessage({
        "en-US": "Reading package.json",
        "pt-BR": "Lendo package.json",
    });

    const packageJson = await readPackageJSON(resolveDistPath("package.json"));

    packageJson.name = npmName;

    if (database){
        generating.text = uiMessage({
           "en-US": "Setting up the database",
           "pt-BR": "Configurando o banco de dados",
        });

        const dbPath = path.join(templatePath, "databases");
        merge(packageJson, database.packageJson);

        if (database.env){
            await updateEnv(projectFiles.envSchema, envEditor, database.env);
        }
        if (database.path){
            await copy(path.join(dbPath, database.path), distPath);
        }
        if (orm){
            merge(packageJson, orm.packageJson);
            
            await copy(path.join(dbPath, orm.path), distPath);
            if (orm.env){
                await updateEnv(projectFiles.envSchema, envEditor, orm.env);
            }
        };
    }

    if (server){
        generating.text = uiMessage({
            "en-US": "Setting up the API Server...",
            "pt-BR": "Configurando Servidor de API...",
        });

        const serversPath = path.join(templatePath, "servers");
        merge(packageJson, server.packageJson);
        if (server.env){
            await updateEnv(projectFiles.envSchema, envEditor, server.env);
        }
        await copy(path.join(serversPath, server.path), distPath);

        projectFiles.index.addImportDeclaration({
            moduleSpecifier: "#server"
        });
    }

    if (token){
        generating.text = uiMessage({
            "en-US": "Writing the token to the .env file...",
            "pt-BR": "Escrevendo o token no arquivo .env...",
        });
        envEditor.set("BOT_TOKEN", token);
    };
    const extraFeaturesPath = path.join(templatePath, "extras");

    await copy(
        path.join(extraFeaturesPath, "gitignore.txt"),
        resolveDistPath(".gitignore")
    )
    if (extraFeatures.includes("discloud")){
        const folder = path.join(extraFeaturesPath, props.isBun ? "bun" : "discloud");
        await copy(
            path.join(folder, "discloud.ignore.txt"),
            resolveDistPath(".discloudignore")
        )
        await copy(
            path.join(folder, "discloud.config.txt"),
            resolveDistPath("discloud.config")
        )
        if (props.isBun){
            await copy(
                path.join(folder, "Dockerfile"),
                resolveDistPath("Dockerfile")
            )
        }
    };
    if (extraFeatures.includes("tsup")){
        const tsupPackageJson = await readPackageJSON(
            path.join(extraFeaturesPath, "tsup/package.json")
        );

        merge(packageJson, tsupPackageJson);

        await copy(
            path.join(extraFeaturesPath, "tsup/tsup.config.ts"),
            resolveDistPath("tsup.config.ts")
        )
    }

    const baseVersionPath = resolveDistPath("src/discord/base/base.version.ts");
    await readFile(baseVersionPath, "utf-8")
        .then(content => content.replace("{{baseVersion}}", props.version))
        .then(content => writeFile(baseVersionPath, content, "utf-8"))
        .catch(() => null);

    packageJson.baseVersion = props.version;

    if (selectedScripts.length >= 1){
        await applyScriptPresets({
            configdir: props.configdir,
            presets: selectedScripts,
            packageJson,
            distPath,
        });
    }

    if (props.isBun){
        const bunPkgJson = await readPackageJSON(
            path.join(extraFeaturesPath, "bun/package.json")
        );
        merge(packageJson, bunPkgJson);
        packageJson.devDependencies??={}        
        delete packageJson.devDependencies["tsx"];
        delete packageJson.devDependencies["@types/node"];
    }

    await json.write(resolveDistPath("package.json"), packageJson);

    project.save();
    envEditor.save();

    if (installAllDeps){
        await installDeps({ 
            distpath: distPath, 
            spinner: generating, 
            command: manager, 
        });
        divider();
    }
    generating.stop();
    
    log.success(uiMessage({
       "en-US": "Project generate successfully!",
       "pt-BR": "Projeto gerado com sucesso!",
    }));
    divider();

    if (!isDistRoot){
        log.custom(ck.green("➞"), uiMessage({
           "en-US": `Use: ${getCdPath(distPath)}`,
           "pt-BR": `Use: ${getCdPath(distPath)}`,
        }));
    }
    if (!installAllDeps){
        log.custom(ck.green("➞"), uiMessage({
            "en-US": "Install the dependencies",
            "pt-BR": "Instale as dependências",
        }));
    }

    log.custom(ck.green("➞"), uiMessage({
        "en-US": `Run ${ck.underline("dev")} script`,
        "pt-BR": `Execute o script ${ck.underline("dev")}`,
    }));

    divider();
    console.log(byeMessage);
    divider();
}