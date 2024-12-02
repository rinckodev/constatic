import { cliTheme, discordEmojis, fileExists, log, sleep, uiText } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken, ProgramMenuProps } from "#types";
import { confirm, input } from "@inquirer/prompts";
import ck from "chalk";
import glob from "fast-glob";
import fs from "node:fs/promises";
import path from "node:path";
import ora from "ora";

export async function discordEmojisUploadMenu(props: ProgramMenuProps, token: DiscordBotToken){
    const dirpath = await input({
        message: uiText(props.lang, {
            "pt-BR": "Informe o caminho diretório de imagens",
            "en-US": "Provide the image directory path",
        }),
        theme: cliTheme,
        async validate(dirpath) {
            const resolved = path.resolve(dirpath);
            if (!await fileExists(resolved)){
                return uiText(props.lang, {
                    "en-US": `${dirpath} is not a valid path`,
                    "pt-BR": `${dirpath} não é um caminho válido!`,
                });
            }
            return true;
        }
    });

    const processing = ora();
    processing.start("🔍 Searching for files in nested folders");
    
    const paths = await glob("**/*.{png,jpeg,gif}", { 
        cwd: path.resolve(dirpath), 
        absolute: true
    });
    
    processing.text = "🗃️ Getting information from found files";

    const data: Array<{ base64: string, name: string }> = [];

    for(const filepath of paths){
        const stats = await fs.stat(filepath);
        const size = Math.ceil(stats.size / 1024);
        if (size >= 256) continue;
        
        const ext = path.extname(filepath);
        const name = path.basename(filepath, ext);
        const imagedata = await fs.readFile(filepath, { encoding: "base64" });
        const base64 = `data:image/${ext.slice(1)};base64,${imagedata}`;

        data.push({ base64, name });
    }
    processing.stop();

    if (!data.length){
        log.error("No images found in the given directory");
        await sleep(400);
        menus.discord.emojis.main(props, token);
        return;
    }

    log.success(`Image files available for upload: ${data.length}`);

    log.warn([
        "Depending on the amount of files,", 
        "this process may take some time due", 
        "to Discord API rate limitations."
    ].join("\n"));

    const procced = await confirm({
        message: uiText(props.lang, { 
            "en-US": "Do you want to confirm the image files upload process?",
            "pt-BR": "Você quer confirmar o processo de upload dos arquivos de imagem?",
        })
    });
    
    if (!procced){
        await sleep(400);
        menus.discord.emojis.main(props, token);
        return;
    };

    for(const { name, base64 } of data){
        const uploading = ora();
        uploading.start(uiText(props.lang, {
            "en-US": `Uploading emoji ${ck.yellow.underline(name)}`,
            "pt-BR": `Enviando emoji ${ck.yellow.underline(name)}`,
        }));

        const result = await discordEmojis.create(token, { image: base64, name });
        uploading.stop();
        if (!result.success && result.exists){
            log.fail(uiText(props.lang, {
                "en-US": `An emoji named ${ck.yellow.underline(name)} already exists for this application!`,
                "pt-BR": `Um emoji chamado ${ck.underline.yellow(name)} já existe para essa aplicação!`,
            }, ck.red))
            continue;
        }
        if (!result.success){
            log.error(uiText(props.lang, {
                "en-US": `An error occurred while trying create the emoji ${name}!`,
                "pt-BR": `Ocorreu um erro ao tentar criar o emoji ${name}!`
            }, ck.red));
            continue;
        }

        log.success(uiText(props.lang, {
            "en-US": `${ck.bgGreen(" Created ")} Emoji ${ck.yellow.underline(name)} created successfully!`,
            "pt-BR": `${ck.bgGreen(" Criado ")} Emoji ${ck.yellow.underline(name)} criado com sucesso!`,
        }, ck.green));
    }
}