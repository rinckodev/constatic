import { spinner as createSpinner, log, multiselect, note, outro, select, text } from "@clack/prompts";
import { setTimeout } from "node:timers/promises";
import { PackageJson } from "pkg-types";
import { existsSync } from "node:fs";
import path from "node:path";
import chalk from "chalk";
// import { discordBotExtraFeatures } from "./extra.js";
import { checkCancel, copyDir, getCdProjectPath, json, listDirectoryItems, mergeObject, messages, npmInstall, Package, toNpmName } from "../../helpers/index.js";
import { readFile, writeFile } from "node:fs/promises";
import { menus } from "../index.js";

export type DiscordBotTemplatePaths = Record<
    | "templates" | "project" | "databases" 
    | "extras" | "properties"
, string>

interface DiscordBotMenuProps {
    projectName?: string
}
export async function discordBotInitMenu(props: ProgramProps & DiscordBotMenuProps){
    const cwd = process.cwd();

    const basePath = path.join(props.rootname, "/templates/discord/bot");
    const paths: DiscordBotTemplatePaths = {
        templates: basePath,
        project: path.join(basePath, "project"),
        databases: path.join(basePath, "databases"),
        extras: path.join(basePath, "extras"),
        properties: path.join(basePath, "properties.json"),
    }

    const projectName = props.projectName ?? await text({ 
        message: `Project name ${chalk.dim.underline(`${path.basename(cwd)}/`)}`,
        placeholder: "Use . to create in this directory",
        validate(value) {
            if (!value) return "You must specify a name for the project!"
        },
    }) as string;

    checkCancel(projectName);

    const destinationPath = path.resolve(projectName);
    const destinationIsCwd = destinationPath === cwd;

    const npmName = destinationIsCwd
    ? toNpmName(path.basename(destinationPath))
    : toNpmName(path.basename(projectName));

    log.info(chalk.bgBlue(` ${npmName} `));

    const templateProperties = await json.read<DiscordBotTemplateProperties>(paths.properties);
    
    const database = await select({
        message: "💾 Select database",
        options: [
            { label: "None", value: "none" },
            templateProperties.databases.map(({ name, hint }, index) => ({
                label: name, value: index.toString(), hint,
            }))
        ].flat()
    });

    checkCancel(database);

    const extras = await multiselect({
        message: "✨ Extra features",
        required: false,
        options: [
            { label: "Discloud project", hint: "Host", value: "discloud" }
        ]
    }) as string[];

    checkCancel(extras);

    const tokens = props.conf.get("discord.bot.tokens", []) as DiscordBotToken[];

    const tokenIndex = tokens.length > 0 ? await select({
        message: "Saved token",
        options: [
            { label: "none", value: -1 },
            tokens.map((t, index) => ({ label: t.name, value: index }))
        ].flat()
    }) as number : -1;

    checkCancel(tokenIndex);

    const install = await select({
        message: "📥 Install dependencies?",
        options: [
            Package.managerList.map(name => 
                ({ label: `${chalk.green("Yes")} (${name})`, value: name })
            ),
            { label: chalk.red("No"), value: "no" }
        ].flat()
    }) as string;

    checkCancel(install);

    await copyDir(paths.project, destinationPath, { ignore: getCopyIgnore() });

    const newProjectPackageJson = await json.read<PackageJson>(path.join(destinationPath, "package.json"));
    mergeObject(newProjectPackageJson, { name: npmName });

    if (database !== "none"){
        const { path: databasePath, dependencies={}, scripts={} } = templateProperties.databases[Number(database)];

        mergeObject(newProjectPackageJson, { dependencies, scripts });

        const projectPath = path.join(paths.databases, databasePath);
        if (existsSync(projectPath)){
            await copyDir(projectPath, destinationPath, { ignore: getCopyIgnore() });
        }
    }

    if (tokenIndex !== -1){
        const { token } = tokens[tokenIndex];
        const envPath = path.join(destinationPath, ".env");
        const file = await readFile(envPath, "utf-8");
        const content = file.replace("BOT_TOKEN=", `BOT_TOKEN=${token}`);
        await writeFile(envPath, content, "utf-8");
    }

    // Extras
    await menus.discordbot.extra(destinationPath, paths, extras);

    await json.write(path.join(destinationPath, "package.json"), newProjectPackageJson);

    const items = listDirectoryItems(destinationPath);

    const message = items.map(
        (item) => `${chalk.green("+")} ${(item.isDirectory() ? "/" : "") + item.name}`
    );

    message.push("");
    
    if (!destinationIsCwd) message.push(`${chalk.green("➞")} use: ${getCdProjectPath(destinationPath)}`)

    if (install !== "no"){
        const spinner = createSpinner();
        spinner.start("Installing dependencies");
        
        const manager = Package.managers[install as keyof typeof Package.managers];
        const result = await npmInstall(destinationPath, manager);

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