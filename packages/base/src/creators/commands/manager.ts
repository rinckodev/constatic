import { ApplicationCommandOptionType, ApplicationCommandType, type ApplicationCommandOptionData, type ApplicationCommandSubCommandData, type ApplicationCommandSubGroupData, type ChatInputApplicationCommandData, type MessageApplicationCommandData, type UserApplicationCommandData } from "discord.js";
import type { Command, CommandModule, SlashCommandOptionData } from "./command.js";

type Runner = Function | null | undefined;

type BuildedCommandData = (
    | UserApplicationCommandData
    | MessageApplicationCommandData
    | ChatInputApplicationCommandData
) & { global?: boolean };

export class CommandManager {
    private readonly collection = new Map<string, Command<unknown, unknown, unknown>>();
    public readonly runners = new Map<string, Runner[]>();
    public set<T, P, R>(command: Command<T, P, R>) {
        this.collection.set(command.data.name, command);
        const path = `/${command.data.type}/${command.data.name}`;
        this.runners.set(path, [command.data.run]);

        if (command.data.autocomplete){
            this.runners.set(
                `${path}/autocomplete`,
                [command.data.autocomplete]
            );
        }
    }
    public build() {
        const commands = Array.from(this.collection.values());

        return commands.map(command => {
            const {
                options: rawOptions, description,
                descriptionLocalizations, ...data
            } = command.data;

            const path = `/${data.type}/${data.name}`;

            const modulesOptions = this.buildModules(
                command.modules, path, data.run
            );

            const options = this.buildOptions([
                ...rawOptions ?? [], ...modulesOptions
            ], path);

            const slashData = data.type === ApplicationCommandType.ChatInput
                ? {
                    description, descriptionLocalizations,
                    ...(options.length >= 1 ? { options } : {})
                }
                : {}

            return { ...data, ...slashData };
        }) as BuildedCommandData[];
    }
    private buildOptions(options: SlashCommandOptionData<boolean>[], path: string) {
        const resolved: ApplicationCommandOptionData[] = [];
        for (const option of options) {
            const description = option.description ?? option.name;

            if (
                "autocomplete" in option &&
                option.autocomplete &&
                typeof option.autocomplete === "function"
            ) {
                this.runners.set(
                    `${path}/autocomplete/${option.name}`,
                    [option.autocomplete]
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
    private buildModules(modules: CommandModule[], path: string, run?: Function): SlashCommandOptionData<boolean>[] {
        const resolved: SlashCommandOptionData<boolean>[] = [];
        if (!modules.length) return resolved;

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
                    this.runners.set(
                        `${path}/${group.name}/${subcommand.name}`,
                        [run, group.run, (subcommand as CommandModule).run]
                    );
                }
            };
        }
        for (const subcommand of subcommands.filter(sub => !sub.group)) {
            this.runners.set(
                `${path}/${subcommand.name}`,
                [run, subcommand.run]
            );
            resolved.push(subcommand);
        }
        return resolved;
    }
    public getHandler(type: ApplicationCommandType, ...path: (string | null)[]) {
        const commandName = path[0];
        const resolved = `/${type}/${path.filter(p => p !== null).join("/")}`;

        return this.runners.get(resolved)
            ?? this.runners.get(`/${type}/${commandName}`);
    }
}