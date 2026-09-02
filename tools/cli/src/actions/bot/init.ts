import { actions } from "#actions/index.js";
import { getCdPath, json, modifyObjArg, toNpmName } from "#helpers";
import { KeyValueFile } from "#lib/kvf.js";
import { program } from "#program";
import { applyScriptPresets } from "#shared/presets/scripts/apply.js";
import type { EnvVarData } from "#types";
import { quit } from "#utils/cancel.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { pkg } from "#utils/pkg.js";
import { createSpinner } from "#utils/spinner.js";
import { copy } from "fs-extra";
import merge from "lodash.merge";
import { cp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { readPackageJSON } from "pkg-types";
import { Project, SourceFile } from "ts-morph";

export interface InitBotActionData {
    dist: string;
    token?: string;
    scripts?: string[];
    server?: string;
    database?: string;
    extras?: string[];
    install?: boolean;
}
export async function initBotAction(data: InitBotActionData) {
    const distJoin = (...paths: string[]) => path.join(data.dist, ...paths);
    const templateJoin = (...paths: string[]) => path.join(program.templates.path, ...paths);

    const isDistRoot = data.dist === process.cwd();

    const generating = createSpinner();
    generating.start("The project is being generated! Please wait...");

    await copyProject(
        templateJoin("project"),
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
    await envFile.read(distJoin("./.env.example"));

    generating.update("Creating environment variables manager");
    const templatePkg = await readPackageJSON(distJoin("package.json"));
    templatePkg.name = toNpmName(path.basename(path.resolve(data.dist)));

    const database = program.templates.props.presets.databases[data.database ?? ""];

    if (database) {
        generating.update("Setting up the database");
        await actions.bot.add.database({
            database, pkg: templatePkg, envFile,
            envSchema: projectFiles.envSchema,
            dist: distJoin()
        });
    }

    const server = program.templates.props.presets.servers[data.server ?? ""];

    if (server) {
        generating.update("Setting up the API Server...");

        await actions.bot.add.server({
            server, pkg: templatePkg, envFile,
            dist: distJoin(),
            ...projectFiles,
        });
    }

    const token = program.config.getToken(data.token ?? "");
    if (token) {
        generating.update("Writing the token to the .env file...");
        envFile.set("BOT_TOKEN", token.token);
    };

    await copy(
        templateJoin("extras", "gitignore.txt"),
        distJoin(".gitignore"),
    )

    if (data.extras?.includes("discloud")) {
        const dir = templateJoin("extras", program.runtime.isBun() ? "bun" : "discloud");
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

        discloudFile.set("NAME", templatePkg.name);
        if (program.runtime.isBun()) {
            discloudFile.set("MAIN", "Dockerfile")
            await copy(
                path.join(dir, "Dockerfile"),
                distJoin("Dockerfile")
            );
        }
        await discloudFile.write();
    }

    if (data.extras?.includes("tsup")) {
        await actions.bot.add.tsup({
            pkg: templatePkg, distdir: distJoin()
        });
    }

    const baseVersionPath = distJoin("src/discord/base/base.version.ts");

    await readFile(baseVersionPath, "utf-8")
        .then(content => content.replace("{{baseVersion}}", pkg.version))
        .then(content => writeFile(baseVersionPath, content, "utf-8"))
        .catch(() => null);

    templatePkg.baseVersion = pkg.version;

    if (data.scripts && data.scripts.length >= 1) {
        const presets = program.config.get("presets.scripts", []);
        const selected = presets.filter(p =>
            data.scripts?.includes(p.name) ||
            data.scripts?.includes(p.alias ?? "")
        );
        await applyScriptPresets({
            pkg: templatePkg, dist: data.dist,
            presets: selected,
        });
    }

    if (program.runtime.isBun()) {
        const bunPkgJson = await readPackageJSON(
            templateJoin("extras", "bun/package.json")
        );
        merge(templatePkg, bunPkgJson);
        templatePkg.devDependencies ??= {}
        delete templatePkg.devDependencies["tsx"];
        delete templatePkg.devDependencies["@types/node"];
    }

    await json.write(distJoin("package.json"), templatePkg);

    await project.save();
    await envFile.write();
    await envFile.write(distJoin(".env.example"), true);

    if (data.install) {
        generating.update("Installing the dependencies...");
        const result = await program.runtime.agentRun(distJoin(), "install");
        generating.stop();
        if (result.success) {
            log.success("✅ Dependencies installed successfully!");
        } else {
            const command = `${program.runtime.agent()} install`;
            log.fail([
                "❌ Unable to install dependencies!",
                `Install manually using ${command}`
            ].join("\n"))
        }
        console.log();
    }
    generating.stop();

    log.success("Project generate successfully!");
    console.log();

    if (!isDistRoot) {
        log.custom(ck.green("➞"),
            `Use: ${getCdPath(data.dist)}`,
        );
    }
    if (!data.install) {
        log.custom(ck.green("➞"),
            "Install the dependencies"
        );
    }

    log.custom(ck.green("➞"),
        `Run ${ck.underline("dev")} script`
    );
    console.log();
    quit();
    console.log();
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
        callname: "z.looseObject",
        source: sourceFile,
        modify: arg => arg.addPropertyAssignments(schema.map(
            ([name, initializer]) => ({ name, initializer })
        ))
    });
    for (const [key, _, value] of schema) {
        envManager.set(key, value);
    }
}