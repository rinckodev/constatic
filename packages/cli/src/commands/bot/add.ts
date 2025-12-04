import { CLI } from "#cli";
import { divider, l, log } from "#helpers";
import { defineCommand } from "citty";
import path, { join } from "node:path";
import { Project } from "ts-morph";
import { actions } from "#actions/index.js";
import { writePackageJSON } from "pkg-types";
import ck from "chalk";
import ora from "ora";
import { commandFlags } from "../flags.js";
import { KeyValueFile } from "#lib/kvf.js";

const plus = ck.green("+");

export default function (cli: CLI) {
    return defineCommand({
        meta: {
            name: "add",
            description: l({
                "pt-BR": "Adicionar estruturas e predefinições à um projeto existente",
                "en-US": "Add strctures and presets to an existing project",
            })
        },
        args: {
            database: commandFlags.database,
            server: commandFlags.server,
            tsup: commandFlags.tsup,
            token: commandFlags.token,
            discloud: commandFlags.discloud,
            install: commandFlags.install,
            force: {
                alias: "f",
                type: "boolean",
                description: l({
                    "pt-BR": "Ignora a restrição de diretório Git",
                    "en-US": "Ignore Git directory restriction",
                }),
            },
            dist: {
                type: "positional",
                required: false,
                description: l({
                    "pt-BR": "Caminho de destino do projeto",
                    "en-US": "Project dist path",
                })
            },
        },
        async run(context) {
            const args = context.args;

            const dist = path.resolve(args.dist ?? process.cwd());

            const force = args.force ?? args.f ?? false;

            if (!force && cli.shell.isRepoDirty(dist)) {
                log.error(l({
                    "pt-BR": "O diretório Git não está limpo. Salve-as (com um commit) ou guarde-as temporariamente (com git stash) antes!",
                    "en-US": "The Git directory is not clean. Stash or commit your changes first!",
                }));
                log.warn(l({
                    "pt-BR": `Você pode usar a flag ${ck.blue("--force")} para ignorar isso!`,
                    "en-US": `You can use the ${ck.blue("--force")} flag to bypass this!`,
                }));
                process.exit(1);
            }
            const pkg = await cli.fs.readPkgJson(dist);

            if (!pkg) {
                log.warn(l({
                    "pt-BR": `O Arquivo ${ck.yellow("package.json")} não foi encontrado no diretório!`,
                    "en-US": `The ${ck.yellow("package.json")} file was not found in the directory`,
                }));
                process.exit(1);
            }

            const adding = ora();
            adding.start(l({
                "en-US": "Adding selected items! Please wait",
                "pt-BR": "Adicionando itens selecionados! Aguarde",
            }));

            const data = {
                database: args.database ?? args.db,
                server: args.server ?? args.sv,
                token: args.token ?? args.tk,
                discloud: !!(args.discloud ?? args.d),
                tsup: !!(args.tsup ?? args.t),
                install: !!(args.install ?? args.i),
                dist: args.dist ?? process.cwd(),
            };

            if (!(await cli.fs.exists(join(dist, "tsconfig.json")))) {
                adding.stop();
                log.warn(l({
                    "pt-BR": `O Arquivo ${ck.yellow("tsconfig.json")} não foi encontrado no diretório!`,
                    "en-US": `The ${ck.yellow("tsconfig.json")} file was not found in the directory`,
                }));
                process.exit(1);
            }


            const envFile = new KeyValueFile(join(dist, "./.env"));
            await envFile.read(); 

            const project = new Project({
                tsConfigFilePath: join(dist, "tsconfig.json")
            });
            const projectFiles = {
                envSchema: project.addSourceFileAtPath(
                    join(dist, "src/env.ts")
                ),
                index: project.addSourceFileAtPath(
                    join(dist, "src/index.ts")
                ),
            }

            const database = cli.templates
                .bot.presets.databases[data.database ?? ""];

            if (database) {
                adding.text = l({
                    "pt-BR": `Adicionando banco de dados: ${database.name}`,
                    "en-US": `Adding database: ${database.name}`
                });
                await actions.bot.add.database({
                    cli, database, dist, envFile,
                    envSchema: projectFiles.envSchema,
                    pkg,
                });
                adding.stop();
                console.log(plus, l({
                    "pt-BR": `Banco de dados: ${database.name}`,
                    "en-US": `Database: ${database.name}`
                }));
                adding.start();
            }

            const server = cli.templates
                .bot.presets.servers[data.server ?? ""];

            if (server) {
                adding.text = l({
                    "pt-BR": `Adicionando servidor http: ${server.name}`,
                    "en-US": `Adding http server: ${server.name}`
                });
                await actions.bot.add.server({
                    cli, server, dist, envFile,
                    ...projectFiles,
                    pkg,
                });
                adding.stop();
                console.log(plus, l({
                    "pt-BR": `Servidor http: ${server.name}`,
                    "en-US": `Http server: ${server.name}`
                }));
                adding.start();
            }

            const token = cli.config.getToken(data.token ?? "");
            if (token) {
                adding.text = l({
                    "pt-BR": `Adicionando token salvo`,
                    "en-US": `Adding saved token`
                });
                envFile.set("BOT_TOKEN", token.token);
                adding.stop();
                console.log(plus, l({
                    "pt-BR": `Token salvo: ${token.name}`,
                    "en-US": `Saved token: ${token.name}`
                }));
                adding.start();
            }

            if (data.discloud) {
                adding.text = l({
                    "pt-BR": `Adicionando arquivos Discloud`,
                    "en-US": `Adding Discloud files`
                });
                await actions.bot.add.discloud({ cli, dist });
                adding.stop();
                console.log(plus, l({
                    "pt-BR": `Arquivos Discloud`,
                    "en-US": `Discloud files`
                }));
                adding.start();
            }

            if (data.tsup) {
                adding.text = l({
                    "pt-BR": `Adicionando compilador tsup`,
                    "en-US": `Adding tsup compiler`
                });
                await actions.bot.add.tsup({
                    cli, distdir: dist, pkg,
                });
                adding.stop();
                console.log(plus, l({
                    "pt-BR": `Compilador tsup`,
                    "en-US": `Tsup compiler`
                }));
                adding.start();
            }

            await envFile.write();
            await envFile.write(join(dist, "./.env.example"), true);
            await writePackageJSON(path.join(dist, "package.json"), pkg);

            if (data.install) {
                adding.text = l({
                    "pt-BR": `Instalando dependências`,
                    "en-US": `Installing dependencies`
                });
                await cli.shell.run(dist, "install");
                adding.stop();
                log.success(l({
                    "pt-BR": `Dependências instaladas!`,
                    "en-US": `Dependencies installed!`
                }));
                adding.start();
            }

            adding.stop();

            divider();
            console.log(ck.green("✓"), l({
                "pt-BR": `Os itens selecionados foram adicionados ao projeto!`,
                "en-US": `The selected items have been added to the project!`
            }));

        },
    })
}