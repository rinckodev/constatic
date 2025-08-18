import { isDefined, limitText, spaceBuilder } from "@magicyan/discord";
import ck from "chalk";
import { ApplicationCommandData, ApplicationCommandOptionData, ApplicationCommandOptionType, ApplicationCommandSubCommandData, ApplicationCommandSubGroupData, ApplicationCommandType, Collection } from "discord.js";
import { AutocompleteRun, CommandModule, CommandType, GenericAppCommandData, SlashCommandOptionData } from "./types.js";

type StoredAppCommandData =
    & GenericAppCommandData
    & Required<Pick<GenericAppCommandData, "type">>
    & { modules?: CommandModule[] }

type BuildedCommandData = ApplicationCommandData & { global?: boolean };

type Runner = Function | null | undefined;

export class CommandManager {
    private readonly collection = new Collection<string, StoredAppCommandData>();
    private readonly commandRunners = new Collection<string, Runner[]>();
    private readonly autocompleteRunners = new Collection<string, AutocompleteRun<string | number, boolean>>();

    public readonly logs: string[] = [];

    private formatName(name: string, type = ApplicationCommandType.ChatInput) {
        return limitText(
            type === ApplicationCommandType.ChatInput
                ? name.toLowerCase().replaceAll(" ", "")
                : name,
            32
        )
    }
    public clear() {
        this.collection.clear();
    }
    public getAutocompleteHandler(...path: (string | null)[]) {
        const commandName = path[0];
        const type = ApplicationCommandType.ChatInput;
        const resolved = `/${type}/${path.filter(isDefined).join("/")}`;

        return this.autocompleteRunners.get(resolved) ??
            this.autocompleteRunners.get(`/${type}/${commandName}`);
    }
    public getHandler(type: ApplicationCommandType, ...path: (string | null)[]) {
        const commandName = path[0];
        const resolved = `/${type}/${path.filter(isDefined).join("/")}`;

        return this.commandRunners.get(resolved) ??
            this.commandRunners.get(`/${type}/${commandName}`);
    }
    public getTitle(type?: CommandType) {
        return {
            [ApplicationCommandType.ChatInput]:
                ["{/}", "Slash command"],
            [ApplicationCommandType.User]:
                ["{☰}", "User context menu"],
            [ApplicationCommandType.Message]:
                ["{☰}", "Message context menu"],
        }[type ?? ApplicationCommandType.ChatInput]
    }
    private buildOptions(options: SlashCommandOptionData<boolean>[], path: string) {
        const resolved: ApplicationCommandOptionData[] = [];
        for (const option of options) {
            const description = option.description ?? option.name;

            if (
                "autocomplete" in option &&
                option.autocomplete &&
                typeof option.autocomplete === "function"
            ){
                this.autocompleteRunners.set(
                    `${path}/${option.name}`,
                    option.autocomplete
                );
            }

            switch (option.type) {
                case ApplicationCommandOptionType.SubcommandGroup: {
                    const { options: subcommands, ...data } = option;

                    resolved.push({
                        ...data, description,
                        options: this.buildOptions(
                            subcommands, `${path}/${data.name}`
                        ) as ApplicationCommandSubCommandData[]
                    });
                    continue;
                }
                case ApplicationCommandOptionType.Subcommand: {
                    const { options, ...data } = option;
                    resolved.push({
                        ...data,
                        description, ...(options?.length ? {
                            options: this.buildOptions(
                                options, `${path}/${data.name}`
                            ) as Exclude<
                                ApplicationCommandOptionData,
                                | ApplicationCommandSubGroupData
                                | ApplicationCommandSubCommandData
                            >[]
                        } : {})
                    });
                    continue;
                }
                case ApplicationCommandOptionType.String:
                case ApplicationCommandOptionType.Integer:
                case ApplicationCommandOptionType.Number: {
                    const { choices, autocomplete, ...data } = option;

                    const validation = data.type === ApplicationCommandOptionType.String
                        ? { minLength: data.minLength, maxLength: data.maxLength }
                        : { minValue: data.minValue, maxValue: data.maxValue }

                    const extra = autocomplete
                        ? { autocomplete: true, ...validation }
                        : choices?.length 
                            ? { choices: choices.slice(0, 25) } 
                            : validation;

                    resolved.push(Object.assign({
                        ...data, description, ...extra
                    }));
                    continue;
                }
                default: {
                    resolved.push({ ...option, description });
                }
            }
        }
        return resolved;
    }
    private resolveModules(modules: CommandModule[], path: string, run?: Function): SlashCommandOptionData<boolean>[] {
        const resolved: SlashCommandOptionData<boolean>[] = [];
        if (!modules.length) return [];

        const groups = modules.filter(module =>
            module.type === ApplicationCommandOptionType.SubcommandGroup
        );
        const subcommands = modules.filter(module =>
            module.type === ApplicationCommandOptionType.Subcommand
        );

        if (groups.length >= 1) {
            for (const group of groups) {
                const data = [
                    ...(group.options ?? []).map(data => ({
                        ...data,
                        type: ApplicationCommandOptionType.Subcommand as const,
                    })),
                    ...subcommands.filter(
                        sub => sub.group === group.name
                    )
                ]
                resolved.push({ ...group, options: data });

                for (const subcommand of data) {
                    this.commandRunners.set(
                        `${path}/${group.name}/${subcommand.name}`,
                        [run, group.run, (subcommand as CommandModule).run]
                    );
                }
            };
        }
        for (const subcommand of subcommands.filter(sub => !sub.group)) {
            this.commandRunners.set(
                `${path}/${subcommand.name}`,
                [run, subcommand.run]
            );
            resolved.push(subcommand);
        }
        return resolved;
    }
    public set(data: GenericAppCommandData) {
        const type = data.type ?? ApplicationCommandType.ChatInput;
        const name = this.formatName(data.name, type);
        const dmPermission = data.dmPermission ?? false
        const commandData = { ...data, name, type, dmPermission };
        this.collection.set(name, commandData);
        this.commandRunners.set(`/${type}/${name}`, [data.run]);

        if ("autocomplete" in data && data.autocomplete) {
            this.autocompleteRunners.set(
                `/${type}/${name}`, data.autocomplete
            );
        }

        return commandData;
    }
    public build() {
        return Array
            .from(this.collection.values())
            .map(raw => {
                const {
                    options, modules, description,
                    descriptionLocalizations, ...data
                } = raw;

                const path = `/${data.type}/${data.name}`;

                const buildedOptions = this.buildOptions([
                    ...options ?? [],
                    ...this.resolveModules(
                        modules ?? [], path, data.run
                    )
                ], path)

                const slashData = data.type === ApplicationCommandType.ChatInput
                    ? {
                        description: description ?? data.name,
                        descriptionLocalizations,
                        ...(buildedOptions.length >= 1 
                            ? { options: buildedOptions }
                            : {}
                        )
                    }
                    : {}
                return { ...data, ...slashData }
            }) as BuildedCommandData[];
    }
    public addLog(data: GenericAppCommandData) {
        this.logs.push(ck.green(spaceBuilder(
            this.getTitle(data.type),
            ck.gray(">"),
            ck.underline.blue(`${data.name}`),
            "✓",
        )));
    }
    public addModule(commandName: string, module: CommandModule) {
        const command = this.collection.get(commandName);
        if (!command) return;
        command.modules ??= [];
        command.modules.push(module);
    }

}