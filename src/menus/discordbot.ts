import { log, note, text, confirm } from "@clack/prompts";
import chalk from "chalk";
import path from "node:path";
import { checkCancel } from "../helpers/clack";
import { copyDir, isEmptyDir, listDirectoryItems } from "../helpers/files";
import { toNpmName } from "../helpers/project";
import { json } from "../helpers/json";
import { PackageJson } from "../helpers/package";

export async function DiscordBotMenu(props: ProgramProps){
    const cwd = process.cwd();
    const isEmpty = await isEmptyDir(cwd);

    if (!isEmpty){
        log.error("The current directory is not empty!")
        return;
    }

    const projectName = await text({ 
        message: `Project name ${chalk.dim.underline(`${path.basename(cwd)}/`)}`,
        validate(value) {
            if (value.includes(".")) return "Name can not contain \".\"!";
            if (!value) return "You must specify a name for the project!"
        },
    });

    checkCancel(projectName);

    const npmName = toNpmName(String(projectName));
    
    log.info(chalk.bgBlue(` ${npmName} `));

    const next = await confirm({
        message: "Continue?",
    });

    if (!next) return;

    const templatesPath = path.join(props.rootname, "/templates/discord/bot");

    await copyDir(path.join(templatesPath, "project"), cwd, {
        ignoreItems: [
            "node_modules", 
            "package-lock.json", 
            "dist"
        ],
        ignoreExt: [
            ".env.development",
            ".development.json",
        ]
    });

    await copyDir(
        path.join(templatesPath, "tools/gitignore.txt"), 
        path.join(cwd, ".gitignore")
    );

    const items = listDirectoryItems(cwd);

    const message = items.map(
        (item) => `${chalk.green("+")} ${(item.isDirectory() ? "/" : "") + item.name}`
    ).join("\n")

    const newProjectPackageJson = await json.read<PackageJson>(path.join(cwd, "package.json"));
    await json.write(path.join(cwd, "package.json"), {
        ...newProjectPackageJson,
        name: npmName
    })

    note(message, "Done")
}