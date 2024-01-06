import { ApplicationCommandType, AutocompleteInteraction, Client, CommandInteraction, MessageComponentInteraction, ModalSubmitInteraction, version as discordjsVersion } from "discord.js";
import { CustomItents, CustomPartials } from "@magicyan/discord";
import { basename, join } from "node:path";
import ck from "chalk";
import glob from "fast-glob";
import { Command, Component, Modal } from "./index.js";
import { log } from "#settings";

const { __dirname } = importMeta(import.meta);

const foldername = basename(join(__dirname, "../../"));

export function createClient(){
    const client = new Client({
        intents: CustomItents.All,
        partials: [...CustomPartials.All],
        closeTimeout: 0,
    });

    client.start = async function(options){
        this.once("ready", (readyClient) => {
            whenReady(readyClient);
            options?.whenReady?.(readyClient);
        });
        const paths = await glob([
            `./${foldername}/discord/**/*.{ts,js}`,
            `!./${foldername}/discord/base/*`,
        ], { absolute: true });
    
        for(const path of paths) await import(`file://${path}`);
        this.login(process.env.BOT_TOKEN);
    };
    client.on("interactionCreate", interaction => {
        if (interaction.isCommand()) onCommand(interaction);
        if (interaction.isAutocomplete()) onAutoComplete(interaction);
        if (interaction.isMessageComponent()) onComponent(interaction);
        if (interaction.isModalSubmit()) onModal(interaction);
    });
    return client;
}

async function whenReady(client: Client<true>){
    console.log();
    log.success(
        `${ck.green("Bot online")} ${ck.blue.underline("discord.js")} 📦 ${ck.yellow(discordjsVersion)} \n`,
        `${ck.greenBright(`➝ Connected as ${ck.underline(client.user.username)}`)}`,
    );
    console.log();
        
    await client.application.commands.set(Array.from(Command.commands.values()))
    .then(() => log.success(ck.green("Commands registered successfully!")))
    .catch(log.error);
}
function onCommand(commandInteraction: CommandInteraction){
    const command = Command.commands.get(commandInteraction.commandName);
    if (command) {
        command.run(commandInteraction as never, command.store ?? {});
        return;
    }
    log.warn(`Missing function to ${commandInteraction.commandName} command`);
}
function onAutoComplete(interaction: AutocompleteInteraction){
    const command = Command.commands.get(interaction.commandName);
    if (command?.type !== ApplicationCommandType.ChatInput || !command.autoComplete) return;
    command.autoComplete(interaction as never, command.store ?? {});
}
function onComponent(interaction: MessageComponentInteraction){
    const component = Component.get(interaction.customId, interaction.componentType);
    if (component) component.run(interaction as never);
}
function onModal(interaction: ModalSubmitInteraction){
    const modal = Modal.get(interaction.customId);
    if (modal) modal.run(interaction);
}