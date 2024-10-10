import { BotTemplateProperties, BotToken, ProgramMenuProps } from "#types";
import path from "node:path";
import { getCdPath, json, messages, toNpmName } from "#helpers";
import { log, note, outro } from "@clack/prompts"; 
import ck from "chalk";
import { getDist, copyProject, setupDbPreset, apiServerSetup, tokenSetup, extraFeaturesSetup, installDependencies } from "./actions/index.js";
import { apiServerPrompt, dbOrmPrompt, dbPresetPrompt, extraFeaturesPrompt, pkgManagerPrompt, projectNamePrompt, tokenPrompt } from "./prompts/index.js";
import { readPackageJSON } from "pkg-types";
import lodash from "lodash";
import { setTimeout as sleep } from "node:timers/promises";


export async function botMenu(props: ProgramMenuProps){
    const { cwd, cliroot, conf } = props;

    const templatePath = path.join(cliroot, "/templates/discord/bot");
    
    // prompts
    const projectPath = await projectNamePrompt(cwd);
    const { distPath, isDistRoot } = getDist(projectPath, cwd);

    const npmName = toNpmName(path.basename(isDistRoot ? distPath : projectPath));
    log.info(ck.bgBlue(` ${npmName} `));
    
    const properties = await json.read<BotTemplateProperties>(path.join(templatePath, "properties.json"));
    
    const dbPresetIndex = await dbPresetPrompt(properties.dbpresets);
    const dbPreset = properties.dbpresets[dbPresetIndex];
    
    const ormIndex = await dbOrmPrompt(dbPreset);
    
    const extraFeatures = await extraFeaturesPrompt();
    
    const apiServerIndex = await apiServerPrompt(extraFeatures, properties.apiservers);
    
    const tokens = conf.get("discord.bot.tokens", []) as BotToken[];
    const tokenIndex = await tokenPrompt(tokens);
    
    const manager = await pkgManagerPrompt();

    // actions
    
    await copyProject(path.join(templatePath, "project"), distPath);

    const packageJson = await readPackageJSON(path.join(distPath, "package.json"));
    lodash.set(packageJson, "name", npmName);

    if (dbPreset) await setupDbPreset({
        dbPath: path.join(templatePath, "databases"),
        preset: dbPreset, distPath, packageJson, ormIndex,
    });

    if (apiServerIndex !== -1) await apiServerSetup({
        apiServersPath: path.join(templatePath, "extras/servers"),
        preset: properties.apiservers[apiServerIndex],
        packageJson, distPath,
    });

    const token = tokens[tokenIndex];
    if (token) await tokenSetup(distPath, token);

    await extraFeaturesSetup(extraFeatures, path.join(templatePath, "extras"), distPath);

    await json.write(path.join(distPath, "package.json"), packageJson);

    const message: string[] = [];

    if (!isDistRoot) {
        message.push(`${ck.green("➞")} use: ${getCdPath(distPath)}`);
    };

    if (manager !== "no"){
        await installDependencies(distPath, manager);
        await sleep(1200);
    } else {
        message.push(`${ck.green("➞")} install the dependencies`);
    }

    message.push(`${ck.green("➞")} run dev script`);
    note(message.join("\n"), ck.green("✔ Done"));

    outro(messages.bye);
}
