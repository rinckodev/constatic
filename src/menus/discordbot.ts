import { log, text } from "@clack/prompts";
import { isEmptyDir } from "../helpers/files";
import { toNpmName } from "../helpers/project";
import chalk from "chalk";
import path from "node:path";

export async function DiscordBotMenu(){
    const cwd = process.cwd();
    const isEmpty = await isEmptyDir(cwd);

    if (!isEmpty){
        log.error("The current directory is not empty!")
        return;
    }

    const projectName = await text({ 
        message: `Project name ${chalk.dim.underline(`${path.basename(cwd)}/`)}`,
    });
    const npmName = toNpmName(String(projectName));

    log.success(npmName);
}