import { fetchNpmPackage, instructions, searchSelect, sleep, theme } from "#helpers";
import { ScriptPreset } from "#program";
import { packageJsonHasDeps } from "#shared/presets/scripts/deps.js";
import { prompts } from "#shared/prompts.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { createSpinner } from "#utils/spinner.js";
import { Separator } from "@inquirer/prompts";
import { glob } from "tinyglobby";
import { formatPresetFiles } from "./format.js";
import { printPreview } from "./preview.js";

export async function modifyScriptPresetMenu(
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
        const action = await prompts.select({
            message: ck.reset.cyan.underline("❑ New script preset"),
            choices: [
                existing ? {
                    name: ck.blue("✎ Edit name"),
                    value: "name"
                } : null,
                {
                    name: ck.blue("✎ Edit alias"),
                    value: "alias"
                },
                {
                    name: ck.green("🗐 Select files"),
                    value: "select"
                },
                hasFiles && {
                    name: ck.redBright("✗ Remove files"),
                    value: "rm"
                },
                {
                    name: ck.green("☶ Add dependencies"),
                    value: "deps"
                },
                hasDeps && {
                    name: ck.redBright("✗ Remove dependencies"),
                    value: "uninstall"
                },
                {
                    name: ck.green("⦿ Preview"),
                    value: "preview",
                    disabled,
                },
                {
                    name: ck.green("↯ Save"),
                    value: "save",
                    disabled,
                },
                {
                    name: ck.red("⤶ Cancelar"),
                    value: "cancel"
                },
            ].filter(choice => !!choice),
            pageSize: 10,
        });
        console.log();

        switch (action) {
            case "name": {
                preset.name = await prompts.input({
                    message: "Preset name",
                    required: true,
                });
                console.log();
                continue;
            }
            case "alias": {
                preset.alias = await prompts.input({
                    message: "Preset alias",
                    required: true,
                });
                console.log();
                continue;
            }
            case "select": {
                const filepaths = await glob([
                    "./**",
                    "!**/node_modules/**"
                ]);

                const files = await searchSelect({
                    message: "Select the files you want",
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
                }); // TODO

                const filtered = files.filter(filepath =>
                    !preset.files.some(p => p.path === filepath)
                );

                preset.files.push(
                    ...filtered.map(p => ({ path: p, dist: p })
                ));
                continue;
            }
            case "rm": {
                const files = await searchSelect({
                    message: "Select the files you want delete",
                    options: queryFiles
                }); // TODO
                console.log();

                preset.files = preset.files.filter(
                    ({ path, dist = path }) => !files.includes(dist)
                );
                continue;
            }
            case "deps": {
                const name = await prompts.input({
                    message: "Enter the dependency name:",
                    required: true,
                });

                const loading = createSpinner()
                    .start("Fetching package");

                const result = await fetchNpmPackage(name);
                loading.stop();
                console.log();

                if (!result.success) {
                    log.error(result.error);
                    await sleep(300);
                    continue;
                }

                const packageName = result.data.name;
                const version = result.data.selectedVersion;

                log.success(`Package ${packageName} / version: ${version}`);
                console.log();


                const type = await prompts.select({
                    message: "Select the type of dependency",
                    choices: [
                        {
                            name: ck.green("Production dependency"),
                            value: "dependencies"
                        },
                        {
                            name: ck.green("Development dependency"),
                            value: "devDependencies"
                        },
                    ]
                });
                console.log();


                preset.packageJson ??= {};
                preset.packageJson[type] ??= {}
                preset.packageJson[type][packageName] = version;

                log.success(`Dependency successfully added to preset`);
                console.log();
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

                const deps = await prompts.checkbox({
                    message: `Select the dependencies you want to remove`,
                    choices,
                });
                console.log();

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
                console.log();
                await sleep(400);
                continue;
            }
            case "save": {
                if (!preset.files.length && !preset.packageJson) {
                    log.error(`You need to add files and/or dependencies to create a preset.`);
                    console.log();
                    await sleep(400);
                    continue;
                }
                printPreview(preset);
                console.log();
                const action = await prompts.select({
                    message: ck.reset.cyan.underline("❑ Save script preset"),
                    choices: [
                        {
                            name: ck.green("↪ Continue to save"),
                            value: "continue"
                        },
                        {
                            name: ck.blue("✎ Back to edit"),
                            value: "back"
                        },
                        {
                            name: ck.red("⤶ Cancel"),
                            value: "cancel"
                        },
                    ]
                });
                console.log();

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