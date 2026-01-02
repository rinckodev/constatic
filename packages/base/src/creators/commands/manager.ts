import { ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, Client, CommandInteraction, InteractionContextType, type ApplicationCommandOptionData, type ApplicationCommandSubCommandData, type ApplicationCommandSubGroupData, type ChatInputApplicationCommandData, type MessageApplicationCommandData, type UserApplicationCommandData } from "discord.js";
import { format, styleText } from "node:util";
import { RunBlockError } from "../../error.js";
import { BaseManager } from "../manager.js";
import type { Command, CommandModule, CommandType, SlashCommandOptionData } from "./command.js";

type Runner = Function | null | undefined;

type BuildedCommandData = (
    | UserApplicationCommandData
    | MessageApplicationCommandData
    | ChatInputApplicationCommandData
) & { global?: boolean };

export class CommandManager extends BaseManager {
    private get config() {
        return this.app.config.commands;
    }
    private readonly collection = new Map<string, Command<unknown, readonly InteractionContextType[], unknown>>();
    public readonly runners = new Map<string, Runner[]>();
    public set<T, C extends readonly InteractionContextType[], R>(command: Command<T, C, R>) {
        this.collection.set(command.data.name, command);
        const path = `/${command.data.type}/${command.data.name}`;
        this.runners.set(path, [command.data.run]);

        if (command.data.autocomplete) {
            this.runners.set(
                `${path}/autocomplete`,
                [command.data.autocomplete]
            );
        }

        const [icon, label] = this.getTitle(<CommandType>command.data.type);

        this.logs.push([
            styleText("green", `${icon} ${label}`),
            styleText("gray", `>`),
            styleText(["blue", "underline"], command.data.name),
            styleText("green", "✓"),
        ].join(" "));
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
    private buildOptions(options: SlashCommandOptionData<readonly InteractionContextType[]>[], path: string) {
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
    private buildModules(modules: CommandModule[], path: string, run?: Function): SlashCommandOptionData<readonly InteractionContextType[]>[] {
        const resolved: SlashCommandOptionData<readonly InteractionContextType[]>[] = [];
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
    public async onAutocomplete(interaction: AutocompleteInteraction) {
        const options = interaction.options;

        const handler = this.getHandler(
            interaction.commandType,
            interaction.commandName,
            "autocomplete",
            options.getSubcommandGroup(false),
            options.getSubcommand(false),
            options.getFocused(true).name
        );
        if (!handler || !handler[0]) return;
        const [run] = handler;

        const choices = await run(interaction);
        if (choices && Array.isArray(choices)) {
            await interaction.respond(choices.slice(0, 25));
        }
    }
    public async onCommand(interaction: CommandInteraction) {
        if (interaction.isPrimaryEntryPointCommand()) return;
        const { middleware, onError, onNotFound } = this.config;

        let isBlock = false;
        const block = () => isBlock = true;
        if (middleware) await middleware(interaction, block);
        if (isBlock) return;

        const path: (string | null)[] = [interaction.commandName];
        if (interaction.isChatInputCommand()) {
            path.push(
                interaction.options.getSubcommandGroup(false),
                interaction.options.getSubcommand(false)
            );
        }

        const handler = this.getHandler(
            interaction.commandType, ...path
        );

        if (!handler) {
            onNotFound?.(interaction);
            return;
        }

        try {
            let result;
            for (const run of handler.filter(h => h !== null && h !== undefined)) {
                result = await run.call({
                    block() {
                        throw new RunBlockError();
                    }
                }, interaction, result);
            }
        } catch (err) {
            if (err instanceof RunBlockError) return;
            if (onError) {
                onError(err, interaction);
                return;
            }
            throw err;
        }
    }
    public async register(client: Client<true>) {
        const guildList = new Set(this.config.guilds);

        const commands = this.build();

        const promises: Promise<unknown>[] = [];
        const manager = client.application.commands;

        const logs: [size: number, location: string][] = [];

        const setGlobal = (commands: BuildedCommandData[]) => {
            promises.push(manager.set(commands).then(
                data => logs.push([
                    data.size, `${client.user.username} application`,
                ])
            ))
        }

        if (guildList.size >= 1) {
            const guildCommands = commands.filter(c => !c.global);
            for (const id of guildList.values()) {
                promises.push(manager.set(guildCommands, id)
                    .then(commands => logs.push([
                        commands.size, `${id} guild`
                    ]))
                );
            }
            const globalCommands = commands.filter(c => c.global);
            if (globalCommands.length >= 1){
                setGlobal(globalCommands);
            }
        } else {
            setGlobal(commands);
        }

        await Promise.all(promises);

        console.log(logs
            .map(([size, location]) => format(
                styleText(
                    "green",
                    "└ %s command%s registered in %s"
                ),
                size,
                size === 1 ? "" : "s",
                styleText("greenBright", location)
            ))
            .join("\n")
        )
    }
}