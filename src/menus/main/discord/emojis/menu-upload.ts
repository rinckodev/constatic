import { discordEmojis, divider, equalsIgnoringCase, log, pathExists, sleep, uiMessage, withDefaults } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken } from "#types";
import { confirm, input, select } from "@inquirer/prompts";
import ck from "chalk";
import { glob } from "@reliverse/reglob";
import fs from "node:fs/promises";
import path from "node:path";
import ora from "ora";
import { CLI } from "#cli";
import { fetchDiscordEmojis } from "#shared/emojis/fetch.js";

const u = ck.underline;

export async function discordEmojisUploadMenu(cli: CLI, token: DiscordBotToken) {
    const emojis = await fetchDiscordEmojis({ cli, token, notCheckAmount: true });
    if (!emojis) return;

    const displayCurrCwd = ck.dim.underline(path.basename(process.cwd())+"/");

    const dirpath = await input(withDefaults({
        message: uiMessage({
            "pt-BR": `Informe o caminho diretório de imagens `,
            "en-US": `Provide the image directory path `,
        }) + `${displayCurrCwd}\n`,
        async validate(dirpath) {
            const exists = await pathExists(path.resolve(dirpath));
            if (!exists) {
                return uiMessage({
                    "en-US": `${dirpath} is not a valid path`,
                    "pt-BR": `${dirpath} não é um caminho válido!`,
                });
            }
            return true;
        },
        default: "./",
    }));

    const processing = ora();
    processing.start(uiMessage({
       "en-US": "🔍 Searching for files in nested folders...",
       "pt-BR": "🔍 Procurando por arquivos nas pastas aninhadas...",
    }));

    const paths = await glob("**/*.{png,jpeg,gif}", {
        cwd: path.resolve(dirpath),
        absolute: true,
    });

    processing.text = uiMessage({
       "en-US": "🗃️ Getting information from found files...",
       "pt-BR": "🗃️ Obtendo informações dos arquivos encontrados...",
    });

    const data: Array<{ base64: string, name: string }> = [];

    for (const filepath of paths) {
        const stats = await fs.stat(filepath);
        const size = Math.ceil(stats.size / 1024);
        if (size >= 256) continue;

        const ext = path.extname(filepath);
        const name = path.basename(filepath, ext);
        const imagedata = await fs.readFile(filepath, { encoding: "base64" });
        const base64 = `data:image/${ext.slice(1)};base64,${imagedata}`;

        data.push({ base64, name: discordEmojis.formatName(name) });
    }
    processing.stop();

    if (!data.length) {
        log.fail(uiMessage({
           "en-US": "No images found in the given directory!",
           "pt-BR": "Nenhum imagem encontrada no diretório fornecido!",
        }));
        menus.discord.emojis.main(cli, token);
        return;
    }

    log.success(uiMessage({
       "en-US": `Image files available for upload: ${data.length}`,
       "pt-BR": `Arquivos de imagens disponíveis para o envio: ${data.length}`,
    }));

    if (data.length >= 50){
        divider();
        log.warn(uiMessage({
            "en-US": [
                "Depending on the amount of files,",
                "this process may take some time due",
                "to Discord API rate limitations."
            ].join("\n"),
            "pt-BR": [
                "Dependendo da quantidade de arquivos",
                "esse processo pode levar algum tempo devido",
                "às limitações de taxa da API do Discord."
            ].join("\n")
        }))
        divider();
    }

    const proceed = await confirm(withDefaults({
        message: uiMessage({
            "en-US": "Do you want to confirm the image files upload process?",
            "pt-BR": "Você quer confirmar o processo de upload dos arquivos de imagem?",
        })
    }));

    if (!proceed) {
        await sleep(400);
        menus.discord.emojis.main(cli, token);
        return;
    };

    const overwrite = await select<"all" | "ask" | "skip">(withDefaults({
        message: uiMessage({
           "en-US": "Select the overwrite method",
           "pt-BR": "Selecione o método de sobrescrição",
        }),
        choices: [
            {
                name: ck.green("✎ ") + uiMessage({
                   "en-US": "Overwrite if exists",
                   "pt-BR": "Sobrescrever se existir",
                }, ck.green),
                value: "all",
            },
            {
                name: ck.cyan("▣ ") + uiMessage({
                   "en-US": "Ask before overwrite",
                   "pt-BR": "Perguntar antes de sobrescrever",
                }, ck.cyan),
                value: "ask",
            },
            {
                name: ck.blue("◎ ") + uiMessage({
                   "en-US": "Skip and do not overwrite",
                   "pt-BR": "Pular e não sobrescrever",
                }, ck.blue),
                value: "skip",
            },
        ],
    }));

    for (const { name, base64 } of data) {
        const emojiName = u.yellow(name);
        const existing = emojis.find(
            emoji => equalsIgnoringCase(emoji.name, name)
        );

        if (existing){
            const deleteEmoji = async () => {
                const result = await discordEmojis.delete(token, existing.id);
                if (!result.success){
                    log.error(uiMessage({
                        "en-US": `An error occurred while trying delete the ${emojiName} emoji!`,
                        "pt-BR": `Ocorreu um erro ao tentar excluir o emoji ${emojiName}!`
                    }, ck.red));
                }
            }
            switch(overwrite){
                case "all":{
                    await deleteEmoji();
                    break;
                }
                case "ask":{
                    log.warn(uiMessage({
                        "en-US": `An emoji named ${emojiName} already exists!`,
                        "pt-BR": `Um emoji chamado ${emojiName} já existe!`,
                    }));
                
                    const proceed = await confirm(withDefaults({
                        message: uiMessage({
                            "en-US": `Do you want to overwrite?`,
                            "pt-BR": `Deseja sobrescrever?`,
                        }),
                    }));

                    if (!proceed) continue;
                    await deleteEmoji();
                    break;
                }
                case "skip":{
                    log.custom(ck.yellow("◎"), uiMessage({
                       "en-US": `${ck.bold.yellow("Skipped")} → Skipped existing ${emojiName} emoji!`,
                       "pt-BR": `${ck.bold.yellow("Pulado")} → Emoji ${emojiName} já existente pulado!`,
                    }));
                    continue;
                }
            }
        }

        const uploading = ora();
        uploading.start(uiMessage({
            "en-US": `Uploading emoji ${ck.yellow.underline(name)}`,
            "pt-BR": `Enviando emoji ${ck.yellow.underline(name)}`,
        }));

        const result = await discordEmojis.create(token, { image: base64, name });
        uploading.stop();
        if (!result.success && result.code === 1) {
            log.fail(uiMessage({
                "en-US": `An emoji named ${emojiName} already exists for this application!`,
                "pt-BR": `Um emoji chamado ${emojiName} já existe para essa aplicação!`,
            }, ck.red));
            continue;
        }
        if (!result.success) {
            log.error(uiMessage({
                "en-US": `An error occurred while trying ${existing ? "overwrite" : "create"} the ${emojiName} emoji!`,
                "pt-BR": `Ocorreu um erro ao tentar ${existing ? "sobrescrever" : "criar"} o emoji ${emojiName}!`
            }, ck.red) + ck.red.dim(result.error));
            continue;
        }

        log.custom(ck.green("✦"), uiMessage({
            "en-US": `${ck.bold.green(existing ? "Overwrited" : "Created")} → ${emojiName} ${u.dim.green(result.data.id)}`,
            "pt-BR": `${ck.bold.green(existing ? "Sobrescrito" : "Criado")} → ${emojiName} ${u.dim.green(result.data.id)}`,
        }));
    }

    divider();
    log.success(uiMessage({
       "en-US": "Uploading process completed!",
       "pt-BR": "Processo de envio concluído!",
    }, ck.green));
    divider();

    await sleep(500);

    menus.discord.emojis.main(cli, token);
}