import { actions } from "#actions/index.js";
import { KeyValueFile } from "#lib/kvf.js";
import { program } from "#program";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { createSpinner } from "#utils/spinner.js";
import { defineCommand } from "citty";
import path, { join } from "node:path";
import { writePackageJSON } from "pkg-types";
import { Project } from "ts-morph";
import { commandFlags } from "../flags.js";

const plus = ck.green("+");

export default function () {
    return defineCommand({
        meta: {
            name: "add",
            description: "Add strctures and presets to an existing project"
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
                description: "Ignore Git directory restriction"
            },
            dist: {
                type: "positional",
                required: false,
                description: "Project dist path"
            },
        },
        async run(context) {
            const args = context.args;

            const dist = path.resolve(args.dist ?? process.cwd());

            const force = args.force ?? args.f ?? false;

            if (!force &&  program.fs.isRepoDirty(dist)) {
                log.error("The Git directory is not clean. Stash or commit your changes first!");
                log.warn(`You can use the ${ck.blue("--force")} flag to bypass this!`);
                process.exitCode = 0;
                return;
            }
            const pkg = await program.fs.readPkgJson(dist);

            if (!pkg) {
                log.warn(`The ${ck.yellow("package.json")} file was not found in the directory`);
                process.exitCode = 1;
                return;
            }

            const adding = createSpinner();
            adding.start("Adding selected items! Please wait");

            const data = {
                database: args.database ?? args.db,
                server: args.server ?? args.sv,
                token: args.token ?? args.tk,
                discloud: !!(args.discloud ?? args.d),
                tsup: !!(args.tsup ?? args.t),
                install: !!(args.install ?? args.i),
                dist: args.dist ?? process.cwd(),
            };

            if (!(await program.fs.exists(join(dist, "tsconfig.json")))) {
                adding.stop();
                log.warn(`The ${ck.yellow("tsconfig.json")} file was not found in the directory`);
                process.exitCode = 1;
                return;
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

            const database = program.templates
                .props.presets.databases[data.database ?? ""];

            if (database) {
                adding.update(`Adding database: ${database.name}`);
                await actions.bot.add.database({
                    database, dist, envFile,
                    envSchema: projectFiles.envSchema,
                    pkg,
                });
                adding.stop();
                console.log(plus, `Database: ${database.name}`);
                adding.start();
            }

            const server = program.templates
                .props.presets.servers[data.server ?? ""];

            if (server) {
                adding.update(`Adding API server: ${server.name}`);
                await actions.bot.add.server({
                    server, dist, envFile,
                    ...projectFiles,
                    pkg,
                });
                adding.stop();
                console.log(plus, `Http server: ${server.name}`);
                adding.start();
            }

            const token = program.config.getToken(data.token ?? "");
            if (token) {
                adding.update(`Adding saved token`);
                envFile.set("BOT_TOKEN", token.token);
                adding.stop();
                console.log(plus, `Saved token: ${token.name}`);
                adding.start();
            }

            if (data.discloud) {
                adding.update(`Adding Discloud files`);
                await actions.bot.add.discloud({ dist });
                adding.stop();
                console.log(plus, `Discloud files`);
                adding.start();
            }

            if (data.tsup) {
                adding.update(`Adding tsup compiler`);
                await actions.bot.add.tsup({
                    distdir: dist, pkg,
                });
                adding.stop();
                console.log(plus, `Tsup compiler`);
                adding.start();
            }

            await envFile.write();
            await envFile.write(join(dist, "./.env.example"), true);
            await writePackageJSON(path.join(dist, "package.json"), pkg);

            if (data.install) {
                adding.update(`Installing dependencies`);
                await program.runtime.agentRun(dist, "install");
                adding.stop();
                log.success(`Dependencies installed!`);
                adding.start();
            }

            adding.stop();

            console.log();
            console.log(ck.green("✓"), 
                `The selected items have been added to the project!`
            );
        },
    })
}