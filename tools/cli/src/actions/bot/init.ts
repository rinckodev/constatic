import { byeMessage, divider, getCdPath, json, log, modifyObjArg, toNpmName, uiMessage } from "#helpers";
import ck from "chalk";
import merge from "lodash.merge";
import { cp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ora from "ora";
import { readPackageJSON } from "pkg-types";
import { Project, SourceFile } from "ts-morph";
import { type CLI } from "#cli";
import type { EnvVarData } from "#types";
import { copy } from "fs-extra";
import { applyScriptPresets } from "#shared/presets/scripts/apply.js";
import { actions } from "#actions/index.js";
import { KeyValueFile } from "#lib/kvf.js";

export interface InitBotActionData {
    dist: string;
    token?: string;
    scripts?: string[];
    server?: string;
    database?: string;
    extras?: string[];
    install?: boolean;
}
export async function initBotAction(cli: CLI, data: InitBotActionData) {
    const distJoin = (...paths: string[]) => path.join(data.dist, ...paths);
    const templateJoin = (...paths: string[]) => path.join(cli.templates.botPath, ...paths);

    const isDistRoot = data.dist === process.cwd();

    const generating = ora();
    generating.start(uiMessage({
        "en-US": "The project is being generated! Please wait...",
        "pt-BR": "O projeto está sendo gerado! Aguarde...",
    }));

    await copyProject(
        path.join(cli.templates.botPath, "project"),
        distJoin(),
    );

    const project = new Project({
        tsConfigFilePath: distJoin("tsconfig.json")
    });

    const projectFiles = {
        envSchema: project.addSourceFileAtPath(
            distJoin("src/env.ts")
        ),
        index: project.addSourceFileAtPath(
            distJoin("src/index.ts")
        ),
    }

    const envFile = new KeyValueFile(distJoin("./.env"));
    await envFile.read();
    // const envManager = new EnvManager(distJoin("./.env"));

    generating.text = uiMessage({
        "en-US": "Creating environment variables manager",
        "pt-BR": "Criando gerenciador de variáveis de ambiente",
    });
    
    const pkg = await readPackageJSON(distJoin("package.json"));
    pkg.name = toNpmName(path.basename(path.resolve(data.dist)));

    const database = cli.templates.bot.presets.databases[data.database ?? ""];

    if (database) {
        generating.text = uiMessage({
            "en-US": "Setting up the database",
            "pt-BR": "Configurando o banco de dados",
        });
        await actions.bot.add.database({
            database, pkg, envFile,
            envSchema: projectFiles.envSchema,
            cli, dist: distJoin()
        });
    }

    const server = cli.templates.bot.presets.servers[data.server ?? ""];

    if (server) {
        generating.text = uiMessage({
            "en-US": "Setting up the API Server...",
            "pt-BR": "Configurando Servidor de API...",
        });

        await actions.bot.add.server({
            server, pkg, envFile, 
            cli, dist: distJoin(),
            ...projectFiles,
        });
    }

    const token = cli.config.getToken(data.token ?? "");
    if (token) {
        generating.text = uiMessage({
            "en-US": "Writing the token to the .env file...",
            "pt-BR": "Escrevendo o token no arquivo .env...",
        });
        envFile.set("BOT_TOKEN", token.token);
        // envManager.set("BOT_TOKEN", token.token);
    };

    await copy(
        templateJoin("extras", "gitignore.txt"),
        distJoin(".gitignore"),
    )

    if (data.extras?.includes("discloud")) {
        const dir = templateJoin("extras", cli.shell.isBun ? "bun" : "discloud");
        // const dir = templateJoin("extras", "discloud");
        await copy(
            path.join(dir, "discloud.ignore.txt"),
            distJoin(".discloudignore")
        );
        await copy(
            path.join(dir, "discloud.config.txt"),
            distJoin("discloud.config")
        );
        const discloudFile = new KeyValueFile(distJoin("discloud.config"));
        await discloudFile.read();

        discloudFile.set("NAME", pkg.name);
        if (cli.shell.isBun){
            discloudFile.set("MAIN", "Dockerfile")
        }
        if (cli.shell.isBun) {
            await copy(
                path.join(dir, "Dockerfile"),
                distJoin("Dockerfile")
            )
        }
        await discloudFile.write();
    }

    if (data.extras?.includes("tsup")) {
        await actions.bot.add.tsup({
            cli, pkg, distdir: distJoin()
        });
    }

    const baseVersionPath = distJoin("src/discord/base/base.version.ts");

    await readFile(baseVersionPath, "utf-8")
        .then(content => content.replace("{{baseVersion}}", cli.pkg.version))
        .then(content => writeFile(baseVersionPath, content, "utf-8"))
        .catch(() => null);

    pkg.baseVersion = cli.pkg.version;

    if (data.scripts && data.scripts.length >= 1){
        const presets = cli.config.get("presets.scripts", []);
        const selected = presets.filter(p =>
            data.scripts?.includes(p.name) ||
            data.scripts?.includes(p.alias??"")
        );
        await applyScriptPresets(cli, {
            pkg, dist: data.dist, 
            presets: selected, 
        });
    }

    if (cli.shell.isBun) {
        const bunPkgJson = await readPackageJSON(
            templateJoin("extras", "bun/package.json")
        );
        merge(pkg, bunPkgJson);
        pkg.devDependencies ??= {}
        delete pkg.devDependencies["tsx"];
        delete pkg.devDependencies["@types/node"];
    }

    await json.write(distJoin("package.json"), pkg);

    await project.save();
    await envFile.write();
    await envFile.write(distJoin(".env.example"), true);
    // await envManager.save();
    // await envManager.createExample(distJoin(".env.example"));

    if (data.install) {
        generating.text = uiMessage({
            "en-US": "Installing the dependencies...",
            "pt-BR": "Instalando as dependências...",
        });
        const result = await cli.shell.run(distJoin(), "install");
        generating.stop();
        if (result.success) {
            log.success(uiMessage({
                "en-US": "✅ Dependencies installed successfully!",
                "pt-BR": "✅ Dependências instaladas com sucesso!",
            }));
        } else {
            const command = `${cli.shell.agent} install`;
            log.fail(uiMessage({
                "en-US": [
                    "❌ Unable to install dependencies!",
                    `Install manually using ${command}`
                ].join("\n"),
                "pt-BR": [
                    "❌ Não foi possível instalar dependências!",
                    `Instale manualmente usando ${command}`
                ].join("\n"),
            }))
        }
        divider();
    }
    generating.stop();

    log.success(uiMessage({
        "en-US": "Project generate successfully!",
        "pt-BR": "Projeto gerado com sucesso!",
    }));
    divider();

    if (!isDistRoot) {
        log.custom(ck.green("➞"), uiMessage({
            "en-US": `Use: ${getCdPath(data.dist)}`,
            "pt-BR": `Use: ${getCdPath(data.dist)}`,
        }));
    }
    if (!data.install) {
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

async function copyProject(src: string, dist: string) {
    const items = [
        "node_modules",
        "package-lock.json",
        "build", "dist",
        "deprecated"
    ];
    const extensions = [
        ".env.dev",
        ".env.development",
        ".development.json",
        ".dev.json",
    ];
    await cp(src, dist, {
        recursive: true, force: true,
        filter(source) {
            const basename = path.basename(source);
            if (items.includes(basename)) return false;
            if (extensions.some(ext => basename.endsWith(ext))) return false;
            return true;
        },
    });
}

export async function updateEnv(
    sourceFile: SourceFile,
    envManager: KeyValueFile,
    schema: EnvVarData[]
) {
    await modifyObjArg({
        callname: "z.object",
        source: sourceFile,
        modify: arg => arg.addPropertyAssignments(schema.map(
            ([name, initializer]) => ({ name, initializer })
        ))
    });
    for(const [key, _, value] of schema){
        envManager.set(key, value);
    }
}