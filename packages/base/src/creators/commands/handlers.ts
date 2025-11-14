import type { AutocompleteInteraction, Client, CommandInteraction } from "discord.js";
import { ConstaticApp } from "../../app.js";
import { RunBlockError } from "../../error.js";

export abstract class BaseCommandHandlers {
    static async onAutocomplete(interaction: AutocompleteInteraction) {
        const app = ConstaticApp.getInstance();
        const options = interaction.options;

        const handler = app.commands.getHandler(
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
    static async onCommand(interaction: CommandInteraction) {
        if (interaction.isPrimaryEntryPointCommand()) return;
        const app = ConstaticApp.getInstance();
        const { middleware, onError, onNotFound } = app.config.commands;

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
    static async register(client: Client<true>) {
        const app = ConstaticApp.getInstance();
        
        const guildList = new Set(app.config.commands.guilds);

        const commands = app.commands.build();

        const promises: Promise<unknown>[] = [];
        const manager = client.application.commands;

        if (guildList.size >= 1) {
            const globalCommands = commands.filter(c => c.global);
            const guildCommands = commands.filter(c => !c.global);
            for (const id of guildList.values()) {
                promises.push(manager.set(guildCommands, id))
            }
            promises.push(manager.set(globalCommands));
        } else {
            promises.push(manager.set(commands));
        }

        await Promise.all(promises);
    }
}