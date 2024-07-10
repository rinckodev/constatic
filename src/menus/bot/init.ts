import { log, multiselect, select, text, spinner as createSpinner, note, outro } from "@clack/prompts";
import chalk from "chalk";
import path from "node:path";
import { copy, getCdProjectPath, handleCancel, json, listDirectoryItems, messages, npmInstall, Package, toNpmName } from "../../helpers/index.js";
import { readFile, writeFile } from "node:fs/promises";
import { PackageJson } from "pkg-types";
import { setTimeout } from "node:timers/promises";

type Paths = Record<
    | "template" | "project" | "databases" | "extras" 
    | "destination" | "properties" | "packageJson"
    | "apiservers",
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
        apiservers: path.join(templatePath, "extras/servers")
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
        message: `🧰 Database preset`,
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
        message: `✨ Extra features ${chalk.dim("(press space to select)")}`,
        required: false,
        options: [
            { label: "Discloud project", hint: "Host", value: "discloud" },
            { label: "API Server", hint: "Http", value: "server" },
        ],
    }) as string[];

    handleCancel(extras);

    const apiserverIndex = extras.includes("server") 
    ? await select({
        message: `🌐 API Server framework`,
        options:[
            { label: "None", value: -1 },
            properties.apiservers
            .filter(webserver => webserver.disabled !== true)
            .map((dbpreset, index) => ({
                label: `${dbpreset.emoji} ${dbpreset.name} ${chalk.dim(`(${dbpreset.hint})`)}`, 
                value: index,
            }))
        ].flat()
    }) as number
    : -1

    handleCancel(apiserverIndex);

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
        mergeDependencies(projectPackageJson, dbpreset);
    
        if (dbpreset.env){
            await rewriteEnv(paths.destination, dbpreset.env);
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
            if (ormDb.env){
                await rewriteEnv(paths.destination, ormDb.env);
            }
        } else {
            await copy(path.join(paths.databases, dbpreset.path), paths.destination);  
        }
    }

    if (apiserverIndex !== -1){
        const apiserver = properties.apiservers[apiserverIndex];
        mergeDependencies(projectPackageJson, apiserver);
        
        if (apiserver.env){
            await rewriteEnv(paths.destination, apiserver.env);
        }

        await copy(path.join(paths.apiservers, apiserver.path), paths.destination);  
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

    await json.write(paths.packageJson, projectPackageJson);

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

function mergeDependencies(packageJson: PackageJson, deps: Pick<PackageJson, "dependencies" | "devDependencies">){
    Object.assign(packageJson, {
        dependencies: Object.assign(
            packageJson.dependencies??{},
            deps.dependencies??{}
        ),
        devDependencies: Object.assign(
            packageJson.devDependencies??{},
            deps.devDependencies??{}
        )
    })
}

async function rewriteEnv(destinationPath: string, env: NonNullable<BotProjectPreset["env"]>){
    const envSchemaPath = path.join(destinationPath, "src/settings/env.ts");
    const envSchemaFile = await readFile(envSchemaPath, "utf-8");
    env.schema = env.schema.replaceAll("\\n", "\n");
    let replaceKey = "// Env vars..."
    await writeFile(envSchemaPath, envSchemaFile.replace(
        replaceKey, [env.schema, "    "+replaceKey].join("\n")
    ));

    const envFilePath = path.join(destinationPath, ".env");
    const envExampleFilePath = path.join(destinationPath, ".env.example");
    const [envFile, envExampleFile] = await Promise.all([
        readFile(envFilePath, "utf-8"), readFile(envExampleFilePath, "utf-8")
    ]);
    env.file = env.file.replaceAll("\\n", "\n")
    replaceKey = "BOT_TOKEN="

    await Promise.all([
        writeFile(envFilePath, envFile.replace(replaceKey, [replaceKey, env.file].join("\n"))),
        writeFile(envExampleFilePath, envExampleFile.replace(replaceKey, [replaceKey, env.file].join("\n")))
    ])
}