import { log, multiselect, select, text, spinner as createSpinner, note, outro } from "@clack/prompts";
import chalk from "chalk";
import path from "node:path";
import { copy, getCdProjectPath, handleCancel, json, listDirectoryItems, messages, npmInstall, Package, toNpmName } from "../../helpers/index.js";
import { readFile, writeFile } from "node:fs/promises";
import { PackageJson } from "pkg-types";
import { setTimeout } from "node:timers/promises";
import { shellCommand } from "../../helpers/shell.js";

type Paths = Record<
    "template" | "project" | "databases" | "extras" 
    | "destination" | "properties" | "packageJson", 
    string
>
export async function botInitMenu(props: ProgramProps){
    const { rootname, cwd, conf } = props;

    const templatePath = path.join(rootname, "/templates/discord/bot");
    const paths: Paths = Object.create({
        template: templatePath,
        project: path.join(templatePath, "project"),
        databases: path.join(templatePath, "databases"),
        extras: path.join(templatePath, "extras"),
        properties: path.join(templatePath, "properties.json"),
    });

    const projectName = await text({
        message: `Project name ${chalk.dim.underline(`${path.basename(cwd)}/`)}`,
        placeholder: "Use \".\" to create in this directory",
        validate(value) {
            if (!value){
                return "You must specify a name for the project!"
            }
        },
    })

    handleCancel(projectName)

    Object.assign(paths, { destination: path.resolve(projectName) });
    Object.assign(paths, { packageJson: path.join(paths.destination, "package.json") });
    
    const isDestinationCwd = paths.destination === cwd;

    const npmName = toNpmName(
        path.basename(isDestinationCwd ? paths.destination : projectName)
    );

    log.info(chalk.bgBlue(` ${npmName} `));

    const properties = await json.read<BotProperties>(paths.properties);

    const dbpresetIndex = await select({
        message: `🧰 Select database preset`,
        options:[
            { label: "None", value: -1 },
            properties.dbpresets
            .filter(dbpreset => dbpreset.disabled !== true)
            .map((dbpreset, index) => ({
                label: `${dbpreset.emoji} ${dbpreset.name} ${chalk.dim(`(${dbpreset.hint})`)}`, 
                value: index,
            }))
        ].flat()
    }) as number;

    handleCancel(dbpresetIndex);
    const dbpreset = properties.dbpresets[dbpresetIndex] as BotDatabasePreset | undefined;
    
    const ormDbIndex = dbpreset?.isOrm ? await select({
        message: `${dbpreset.emoji} Select ${dbpreset.name} database preset`,
        options: dbpreset.databases
        .filter(dbpreset => dbpreset.disabled !== true)
        .map((dbtool, index) => ({
            label: `${dbtool.emoji} ${dbtool.name} ${chalk.dim(`(${dbtool.hint})`)}`, 
            value: index,
        }))
    }) as number : -1;

    handleCancel(ormDbIndex);

    const extras = await multiselect({
        message: "✨ Extra features",
        required: false,
        options: [
            { label: "Discloud projet", hint: "Host", value: "discloud" },
            // { label: "Http server", hint: "Api", value: "server" },
        ],
    }) as string[];

    handleCancel(extras);

    const tokens = conf.get("discord.bot.tokens", []) as BotToken[];
    const tokenIndex = tokens.length > 0 ? await select({
        message: "Saved token",
        options: [
            { label: "None", value: -1 },
            tokens.map((t, index) => ({ label: t.name, value: index }))
        ].flat(),
    }) as number : -1

    handleCancel(tokenIndex);

    const packageManager = await select({
        message: "📥 Install dependencies?",
        options: [
            Package.managers.map(name => 
                ({ label: `${chalk.green("Yes")} (${name})`, value: name })
            ),
            { label: chalk.red("No"), value: "no" }
        ].flat()
    }) as string;

    handleCancel(packageManager);

    const copyIgnore = {
        items:[
            "node_modules", 
            "package-lock.json", 
            "build", "dist"
        ],
        extensions: [
            ".env.development",
            ".development.json",
        ]
    }

    await copy(paths.project, paths.destination, { ignore: copyIgnore })

    const projectPackageJson = await json.read(paths.packageJson);
    Object.assign(projectPackageJson, { name: npmName });

    if (dbpreset){
        await genDatabasePreset({ projectPackageJson, dbpreset, ormDbIndex, paths });
    }

    if (tokenIndex !== -1){
        const { token } = tokens[tokenIndex];
        const envPath = path.join(paths.destination, ".env");
        const file = await readFile(envPath, "utf-8");
        const content = file.replace("BOT_TOKEN=", `BOT_TOKEN=${token}`);
        await writeFile(envPath, content, "utf-8");
    }

    await copy(
        path.join(paths.extras, "gitignore.txt"), 
        path.join(paths.destination, ".gitignore")
    );
    
    if (extras.includes("discloud")){
        await copy(
            path.join(paths.extras, "discloud/discloudignore.txt"), 
            path.join(paths.destination, ".discloudignore")
        )
        await copy(
            path.join(paths.extras, "discloud/discloudconfig.txt"), 
            path.join(paths.destination, "discloud.config")
        )
    }
    // if (extras.includes("server")){
    //     // TODO add
    // }

    await json.write(paths.packageJson, projectPackageJson);
    await shellCommand({ command: "git", args: ["init", "."], cwd: paths.destination }).catch(() => null);

    const items = listDirectoryItems(paths.destination);

    const message = items.map(
        (item) => `${chalk.green("+")} ${(item.isDirectory() ? "/" : "") + item.name}`
    );

    message.push("");
    
    if (!isDestinationCwd) message.push(`${chalk.green("➞")} use: ${getCdProjectPath(paths.destination)}`)

    if (packageManager !== "no"){
        const spinner = createSpinner();
        spinner.start("Installing dependencies");
        
        const result = await npmInstall(paths.destination, packageManager);

        switch(result.status){
            case "success":{
                spinner.stop("✅ Dependencies installed successfully!", result.code);
                break;
            }
            case "fail":
            case "error":{
                spinner.stop("❌ Unable to install dependencies!", result.code);
                if (result.status === "error") log.error(result.error.message);
                break;
            }
        }
        await setTimeout(1200);
    } else {
        message.push(`${chalk.green("➞")} install the dependencies`);
    }
    
    message.push(`${chalk.green("➞")} run dev script`);
    note(message.join("\n"), "Done");
    
    if (tokenIndex !== -1){
        const { invite } = tokens[tokenIndex];
        outro([
            "Your bot invite link:",
            chalk.cyan(invite)
        ].join("\n"))
    }
    outro(messages.bye)
}

interface GenDatabasePresetOptions {
    projectPackageJson: PackageJson;
    paths: Paths;
    dbpreset: BotDatabasePreset;
    ormDbIndex: number;
}
async function genDatabasePreset(options: GenDatabasePresetOptions) {
    const { projectPackageJson, paths, dbpreset, ormDbIndex } = options;
    Object.assign(projectPackageJson, {
        dependencies: Object.assign(
            projectPackageJson.dependencies??{},
            dbpreset.dependencies
        )
    })
    if (dbpreset.envSchema){
        await rewriteEnvSchema(paths.destination, dbpreset.envSchema);
    }
    if (dbpreset.isOrm){
        const ormDb = dbpreset.databases[ormDbIndex];
        Object.assign(projectPackageJson, {
            dependencies: Object.assign(
                projectPackageJson.dependencies??{},
                ormDb.dependencies
            )
        })
        await copy(path.join(paths.databases, ormDb.path), paths.destination);
        if (ormDb.envSchema){
            await rewriteEnvSchema(paths.destination, ormDb.envSchema);
        }
        return;
    }
    await copy(path.join(paths.databases, dbpreset.path), paths.destination);        
}

async function rewriteEnvSchema(destinationPath: string, envSchema: string){
    const envSchemaPath = path.join(destinationPath, "src/settings/env.ts");
    const envSchemaFile = await readFile(envSchemaPath, "utf-8");
    envSchema = envSchema.replaceAll("\\n", "\n");
    const replaceKey = "// Env vars..."
    await writeFile(envSchemaPath, envSchemaFile.replace(
        replaceKey, [envSchema, "    "+replaceKey].join("\n")
    ));
}