import { divider, fetchNpmPackage, instructions, log, sleep, uiMessage } from "#helpers";
import { searchSelect, theme, withDefaults } from "../../../../../helpers/prompts.js";
import { ScriptPreset } from "#types";
import { checkbox, input, select, Separator } from "@inquirer/prompts";
import ck from "chalk";
import ora from "ora";
import { formatPresetFiles } from "./format.js";
import { printPreview } from "./preview.js";
import { packageJsonHasDeps } from "#shared/presets/scripts/deps.js";
import { CLI } from "#cli";
import { glob } from "#lib/glob.js";

export async function modifyScriptPresetMenu(
    _cli: CLI,
    preset: ScriptPreset,
    existing: boolean = false,
) {
    let status: "progress" | "save" | "cancel" = "progress";

    const queryFiles = async (term?: string | undefined) => {
        if (!term) return formatPresetFiles(preset.files);

        return formatPresetFiles(preset.files.filter(
            ({ path, dist = path }) => dist.startsWith(term) ||
                dist.endsWith(term) ||
                dist.includes(term)
        ));
    }

    while (status === "progress") {
        const hasFiles = preset.files.length > 0;
        const hasDeps = packageJsonHasDeps(preset.packageJson??{});
        const disabled = (!hasFiles && !hasDeps) ? " " : false;
        const action = await select(withDefaults({
            message: uiMessage({
                "pt-BR": "❑ Nova predefinições de script",
                "en-US": "❑ New script preset",
            }, ck.reset.cyan.underline),
            choices: [
                existing ? {
                    name: uiMessage({
                        "en-US": "✎ Edit name",
                        "pt-BR": "✎ Editar nome",
                    }, ck.blue),
                    value: "name"
                } : null,
                {
                    name: uiMessage({
                        "en-US": "✎ Edit alias",
                        "pt-BR": "✎ Editar alias",
                    }, ck.blue),
                    value: "alias"
                },
                {
                    name: uiMessage({
                        "en-US": "🗐 Select files",
                        "pt-BR": "🗐 Selecionar arquivos",
                    }, ck.green),
                    value: "select"
                },
                hasFiles && {
                    name: uiMessage({
                        "en-US": "✗ Remove files",
                        "pt-BR": "✗ Remover arquivos",
                    }, ck.redBright),
                    value: "rm"
                },
                {
                    name: uiMessage({
                        "en-US": "☶ Add dependencies",
                        "pt-BR": "☶ Adicionar dependências",
                    }, ck.green),
                    value: "deps"
                },
                hasDeps && {
                    name: uiMessage({
                        "en-US": "✗ Remove dependencies",
                        "pt-BR": "✗ Remover dependências",
                    }, ck.redBright),
                    value: "uninstall"
                },
                {
                    name: uiMessage({
                        "en-US": "⦿ Preview",
                        "pt-BR": "⦿ Previsualizar",
                    }, ck.green),
                    value: "preview",
                    disabled,
                },
                {
                    name: uiMessage({
                        "en-US": "↯ Save",
                        "pt-BR": "↯ Salvar",
                    }, ck.green),
                    value: "save",
                    disabled,
                },
                {
                    name: uiMessage({
                        "pt-BR": "⤶ Cancelar",
                        "en-US": "⤶ Cancel",
                    }, ck.red),
                    value: "cancel"
                },
            ].filter(choice => !!choice),
            pageSize: 10,
        }));
        divider();

        switch (action) {
            case "name": {
                preset.name = await input(withDefaults({
                    message: uiMessage({
                        "en-US": "Preset name",
                        "pt-BR": "Nome da predefinição",
                    }),
                    required: true,
                }));
                divider();
                continue;
            }
            case "alias": {
                preset.alias = await input(withDefaults({
                    message: uiMessage({
                        "en-US": "Preset alias",
                        "pt-BR": "Alias da predefinição",
                    }),
                    required: true,
                }));
                divider();
                continue;
            }
            case "select": {
                const filepaths = await glob([
                    "./**",
                    "!**/node_modules/**"
                ]);

                const files = await searchSelect(withDefaults({
                    message: uiMessage({
                        "en-US": "Select the files you want",
                        "pt-BR": "Selecione os arquivos que deseja",
                    }),
                    theme: theme.searchSelect,
                    async options(term) {
                        const format = (value: string) => ({
                            name: value, value
                        });
                        if (!term) return filepaths.map(format);
                        return filepaths.filter(
                            filepath => filepath.startsWith(term) ||
                                filepath.endsWith(term) ||
                                filepath.includes(term)
                        ).map(format);
                    },
                    instructions: instructions.searchSelect,
                }));

                const filtered = files.filter(filepath =>
                    !preset.files.some(p => p.path === filepath)
                );

                preset.files.push(
                    ...filtered.map(p => ({ path: p, dist: p })
                ));
                continue;
            }
            case "rm": {
                const files = await searchSelect(withDefaults({
                    message: uiMessage({
                        "en-US": "Select the files you want delete",
                        "pt-BR": "Selecione os arquivos que deseja deletar",
                    }),
                    options: queryFiles
                }))
                divider();

                preset.files = preset.files.filter(
                    ({ path, dist = path }) => !files.includes(dist)
                );
                continue;
            }
            case "deps": {
                const name = await input(withDefaults({
                    message: uiMessage({
                        "en-US": "Enter the dependency name:",
                        "pt-BR": "Insira o nome da dependência:",
                    }),
                    required: true,
                }));

                const loading = ora({
                    text: uiMessage({
                        "en-US": "Fetching package",
                        "pt-BR": "Buscando pacote"
                    }),
                }).start();

                const result = await fetchNpmPackage(name);
                loading.stop();
                divider();

                if (!result.success) {
                    log.error(result.error);
                    await sleep(300);
                    continue;
                }

                const packageName = result.data.name;
                const version = result.data.selectedVersion;

                log.success(uiMessage({
                    "en-US": `Package ${packageName} / version: ${version}`,
                    "pt-BR": `Pacote ${packageName} / versão: ${version}`
                }));
                divider();


                const type = await select<"dependencies" | "devDependencies">(withDefaults({
                    message: uiMessage({
                        "pt-BR": "Selecione o tipo de dependência",
                        "en-US": "Select the type of dependency",
                    }),
                    choices: [
                        {
                            name: uiMessage({
                                "en-US": "Production dependency",
                                "pt-BR": "Dependência de produção",
                            }, ck.green),
                            value: "dependencies"
                        },
                        {
                            name: uiMessage({
                                "en-US": "Development dependency",
                                "pt-BR": "Dependência de desenvolvimento",
                            }, ck.green),
                            value: "devDependencies"
                        },
                    ]
                }));
                divider();


                preset.packageJson ??= {};
                preset.packageJson[type] ??= {}
                preset.packageJson[type][packageName] = version;

                log.success(uiMessage({
                    "en-US": `Dependency successfully added to preset`,
                    "pt-BR": `Dependência adicionada com sucesso à predefinição`
                }));
                divider();
                continue;
            }
            case "uninstall": {
                const { dependencies, devDependencies } = preset.packageJson ?? {};

                const choices: ({ name: string, value: string } | Separator)[] = [];

                if (dependencies) {
                    choices.push(
                    new Separator(ck.dim("dependencies")),
                    ...Object.entries(dependencies).map(([name, version]) =>
                        ({ name: `${name}@${version}`, value: name })
                    ))
                };
                if (devDependencies) {
                    choices.push(
                    new Separator(ck.dim("devDependencies")),
                    ...Object.entries(devDependencies).map(([name, version]) =>
                        ({ name: `${name}@${version}`, value: name })
                    ))
                };

                const deps = await checkbox({
                    message: uiMessage({
                        "en-US": `Select the dependencies you want to remove`,
                        "pt-BR": `Selecione as dependências que deseja remover`
                    }),
                    choices,
                    instructions: instructions.checkbox,
                });
                divider();

                for (const key in preset.packageJson?.dependencies ?? {}) {
                    if (deps.includes(key)) {
                        delete (preset.packageJson?.dependencies ?? {})[key];
                    }
                }
                for (const key in preset.packageJson?.devDependencies ?? {}) {
                    if (deps.includes(key)) {
                        delete (preset.packageJson?.devDependencies ?? {})[key];
                    }
                }
                continue;
            }
            case "preview": {
                printPreview(preset);
                divider();
                await sleep(400);
                continue;
            }
            case "save": {
                if (!preset.files.length && !preset.packageJson) {
                    log.error(uiMessage({
                        "en-US": `You need to add files and/or dependencies to create a preset.`,
                        "pt-BR": `É necessário adicionar arquivos e/ou dependendências para criar uma predefinição`,
                    }));
                    divider();
                    await sleep(400);
                    continue;
                }
                printPreview(preset);
                divider();
                const action = await select(withDefaults({
                    message: uiMessage({
                        "pt-BR": `❑ Salvar predefinições de script`,
                        "en-US": "❑ Save script preset",
                    }, ck.reset.cyan.underline),
                    choices: [
                        {
                            name: uiMessage({
                                "en-US": "↪ Continue to save",
                                "pt-BR": "↪ Continuar para salvar",
                            }, ck.green),
                            value: "continue"
                        },
                        {
                            name: uiMessage({
                                "en-US": "✎ Back to edit",
                                "pt-BR": "✎ Voltar a edição",
                            }, ck.blue),
                            value: "back"
                        },
                        {
                            name: uiMessage({
                                "pt-BR": "⤶ Cancelar",
                                "en-US": "⤶ Cancel",
                            }, ck.red),
                            value: "cancel"
                        },
                    ]
                }));
                divider();

                if (action === "cancel") {
                    status = action;
                    break;
                }
                if (action === "back") continue;
                status = "save";
                break;
            }
            case "cancel": {
                status = action;
                continue;
            }
        }
    }
    return status;
}