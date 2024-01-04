import { log, text } from "@clack/prompts";
import chalk from "chalk";
import path from "node:path";
import { checkCancel } from "../helpers/clack";
import { isEmptyDir } from "../helpers/files";
import { toNpmName } from "../helpers/project";
import fs from "fs-extra";

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

    const templatesPath = path.join(props.rootname, "/templates/discord/bot");

    fs.copy(templatesPath, cwd);

    log.success(npmName);
}