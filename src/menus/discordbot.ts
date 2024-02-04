import { spinner as createSpinner, log, note, outro, select, text } from "@clack/prompts";
import chalk from "chalk";
import spawn from "cross-spawn";
import { existsSync } from "node:fs";
import path from "node:path";
import { PackageJson } from "pkg-types";
import { Package, checkCancel, copyDir, getCdProjectPath, json, listDirectoryItems, mergeObject, messages, toNpmName } from "../helpers";
import { DiscordBotTemplateProperties } from "../types/discordbot";

export async function DiscordBotMenu(props: ProgramProps){
    const cwd = process.cwd();

    const basePath = path.join(props.rootname, "/templates/discord/bot");
    const paths = {
        templates: basePath,
        project: path.join(basePath, "project"),
        databases: path.join(basePath, "databases"),
        tools: path.join(basePath, "tools"),
        properties: path.join(basePath, "properties.json"),
    }

    const projectName = await text({ 
        message: `Project name ${chalk.dim.underline(`${path.basename(cwd)}/`)}`,
        validate(value) {
            if (!value) return "You must specify a name for the project!"
        },
    }) as string;

    checkCancel(projectName);

    const destinationPath = path.resolve(projectName);

    const destinationIsCwd = destinationPath === cwd;

    const npmName = destinationIsCwd
    ? toNpmName(path.basename(destinationPath))
    : toNpmName(projectName);

    log.info(chalk.bgBlue(` ${npmName} `));

    const templateProperties = await json.read<DiscordBotTemplateProperties>(paths.properties);
    
    const database = await select({
        message: "Select database",
        options: [
            { label: "None", value: "none" },
            ...templateProperties.databases.map(({ name }, index) => ({
                label: name, value: index.toString(),
            }))
        ]
    });

    checkCancel(database);

    const install = await select({
        message: "Install dependencies?",
        options: [
            ...Object.values(Package.managers).map(({ name }) => 
                ({ label: `${chalk.green("Yes")} (${name})`, value: name })
            ),
            { label: chalk.red("No"), value: "no" }
        ]
    });

    checkCancel(install);

    // Process

    await copyDir(paths.project, destinationPath, { ignore: getCopyIgnore() });

    await copyDir(
        path.join(paths.tools, "gitignore.txt"), 
        path.join(destinationPath, ".gitignore")
    );

    const newProjectPackageJson = await json.read<PackageJson>(path.join(destinationPath, "package.json"));
    mergeObject(newProjectPackageJson, { name: npmName });

    if (database !== "none"){
        const { paths: databasePaths, dependencies, scripts } = templateProperties.databases[Number(database)];

        mergeObject(newProjectPackageJson, { dependencies, scripts });

        // todo add variant suport
        const projectPath = path.join(paths.databases, databasePaths.default);
        if (existsSync(projectPath)){
            await copyDir(projectPath, destinationPath, { ignore: getCopyIgnore() });
        }
    }

    await json.write(path.join(destinationPath, "package.json"), newProjectPackageJson);

    const items = listDirectoryItems(destinationPath);

    const message = items.map(
        (item) => `${chalk.green("+")} ${(item.isDirectory() ? "/" : "") + item.name}`
    );

    message.push("");
    
    if (!destinationIsCwd) message.push(`${chalk.green("➞")} use: ${getCdProjectPath(destinationPath)}`)

    const done = () => {
        message.push(`${chalk.green("➞")} run dev script`);
        note(message.join("\n"), "Done");
        outro(messages().bye())
    }

    if (install !== "no"){
        const spinner = createSpinner();
        spinner.start("Installing dependencies");

        const { name, args } = Package.managers[install as keyof typeof Package.managers]
        const child = spawn(name, args, { stdio: "ignore", cwd: destinationPath });
        
        child.on("exit", (code) => {
            spinner.stop(code === 0 
                ? "Dependencies installed successfully!"
                : "Unable to install dependencies!",
                code ?? undefined
            )
            done();
        });
        return;
    }
    message.push(`${chalk.green("➞")} install the dependencies`)
    done();
}

function getCopyIgnore(){
    return {
        items:[
            "node_modules", 
            "package-lock.json", 
            "dist"
        ],
        extensions: [
            ".env.development",
            ".development.json",
        ]
    }
}