import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { ConstaticApp } from "../../app.js";
import { RunBlockError } from "../../error.js";

export abstract class BaseCommandHandlers {
    static async autocomplete(interaction: AutocompleteInteraction) {
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
    static async onCommand(interaction: CommandInteraction){
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
}