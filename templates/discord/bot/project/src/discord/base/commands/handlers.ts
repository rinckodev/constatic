import { brBuilder, isDefined, spaceBuilder } from "@magicyan/discord";
import ck from "chalk";
import { ApplicationCommand, AutocompleteInteraction, Client, Collection, CommandInteraction } from "discord.js";
import { Constatic } from "../app.js";
import { logger } from "../base.logger.js";
import { CommandType, RunBlockError } from "./types.js";

export abstract class BaseCommandHandlers {
    public static async autocomplete(interaction: AutocompleteInteraction) {
        const app = Constatic.getInstance();
        const options = interaction.options;

        const handler = app.commands.getAutocompleteHandler(
            interaction.commandName,
            options.getSubcommandGroup(false),
            options.getSubcommand(false),
            options.getFocused(true).name
        );
        if (!handler) return;

        const choices = await handler(interaction);
        if (choices && Array.isArray(choices)) {
            await interaction.respond(choices.slice(0, 25));
        }
    }
    public static async command(interaction: CommandInteraction) {
        if (interaction.isPrimaryEntryPointCommand()) return;

        const app = Constatic.getInstance();
        const { onNotFound, middleware, onError } = app.config.commands;

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

        const handler = app.commands.getHandler(
            interaction.commandType, ...path
        );

        if (!handler) {
            return onNotFound?.(interaction);
        }

        try {
            let result;
            for (const run of handler.filter(isDefined)) {
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
    public static async register(client: Client<true>) {
        const app = Constatic.getInstance();
        const messages: string[] = [];

        const pluralize = (value: number) => value > 1 ? "s" : "";

        const commands = app.commands.build();

        const createVerboseLogs = (commands: Collection<string, ApplicationCommand>) =>
            commands.map(({ id, name, type, client, createdAt, guild }) => {
                const [icon] = app.commands.getTitle(type as CommandType);
                return ck.dim.green(spaceBuilder(
                    ` └ ${icon}`, ck.underline.cyan(id), "CREATED",
                    ck.underline.blue(name), ck.gray(">"),
                    guild
                        ? `${ck.blue(guild.name)} guild`
                        : `${ck.blue(client.user.username)} application`,
                    ck.gray(">"), "created at:",
                    ck.greenBright(createdAt.toLocaleTimeString()),
                ));
            });

        const logRegistration = (commands: Collection<string, ApplicationCommand>, location: string) => {
            if (!commands.size) return;

            messages.push(ck.greenBright(
                `└ ${commands.size} command${pluralize(commands.size)} successfully registered ${location}!`
            ));

            if (app.config.commands.verbose) {
                messages.push(...createVerboseLogs(commands));
            }
        };

        const targetGuilds = client.guilds.cache.filter(
            ({ id }) => app.config.commands.guilds?.includes(id)
        );

        if (targetGuilds.size) {
            const globalCommands = commands.filter(c => c.global);
            const guildCommands = commands.filter(c => !c.global);

            await Promise.all([
                client.application.commands.set(globalCommands)
                    .then(commands => {
                        if (!commands.size) return;
                        logRegistration(commands, "globally")
                    }
                ),
                ...targetGuilds.map(async (guild) => {
                    const commands = await guild.commands.set(guildCommands);
                    logRegistration(commands, `in ${ck.underline(guild.name)} guild`);
                })
            ]);
        } else {
            await client.application.commands.set(commands)
                .then(commands =>
                    logRegistration(commands, "globally")
                );
            
            client.guilds.cache.forEach(g => g.commands
                .set([]).catch(() => null)
            );
        }

        app.commands.clear();

        if (messages.length) {
            logger.log(brBuilder(messages));
        }
    }
}