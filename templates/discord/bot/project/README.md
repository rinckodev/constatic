# Awesome Bot Base
* [This project was generated using Constatic CLI](https://github.com/rinckodev/constatic)

This is the most complete bot base you've ever seen created by [@rinckodev](https://github.com/rinckodev). This project uses typescript to its advantage, using features to create complete structures that facilitate the construction of commands and systems

! Node version required: 21.5 or higher 

## Scripts

- `dev`: running bot in development
- `build`: build the project
- `watch`: running in watch mode
- `start`: running the builded bot

## Structures

See how to use:
- [Commands](#how-to-use-commands)
- [Events](#how-to-use-events)
- [Components](#how-to-use-components)
- [Modals](#how-to-use-modals)
- [Dotenv](#dotenv)
- [Constants](#constants)


# How to use Commands 

To create a new command, import the Command class from the `src/discord/base` folder. All commands must be created in the `src/discord/commands` folder or subfolders of the commands folder

You can create slash **commands**, **user** and **message** context menus

The run method interaction typing is defined according to the command type

```ts
import { ApplicationCommandType } from "discord.js";
import { Command } from "@/discord/base";

new Command({
    name: "ping",
    description: "Ping command",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){ // ChatInputCommandInteraction

        interaction.reply({ content: "pong" });
    }
});
```

Equivalent code with pure discord.js
```ts
client.on("ready", async (readyClient) => {
    readyClient.application.commands.set([
        {
            name: "ping",
            description: "Ping command",
            dmPermission: false,
            type: ApplicationCommandType.ChatInput,
        }
    ]);
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()){
        switch(interaction.commandName){
            case "ping":{
                interaction.reply({ content: "pong" });
                return;
            }
        }
    }
});
```

```ts
new Command({
    name: "Profile",
    dmPermission: false,
    type: ApplicationCommandType.User, // <= User context menu command type
    async run(interaction){ // UserContextMenuCommandInteraction
        const { targetUser } = interaction;

        interaction.reply({ content: `${targetUser.displayName}'s profile ` });
    }
});
```

```ts
new Command({
    name: "Reply",
    dmPermission: false,
    type: ApplicationCommandType.Message, // <= Message context menu command type
    async run(interaction){ // MessageContextMenuCommandInteraction
        const { targetMessage } = interaction;

        await interaction.deferReply({ ephemeral });
    
        targetMessage.reply({ content: `Hello ${targetMessage.author}!` });
    }
});
```
[Back to the top ↑](#structures)

# How to use Events

To create a listener for a discord.js event, use the Event class from the `src/discord/base` folder

```ts
import { Event } from "@discord/base";

new Event({
    name: "messageUpdate",
    run(oldMessage, newMessage) {
        console.log("Message edited at:", newMessage.editedAt?.toDateString());
        console.log("Author", newMessage.author?.displayName);
        console.log("Old message content: ", oldMessage.content);
        console.log("New message content:", newMessage.content);   
    }
});
```

All discord events are typed in the name property, when choosing an event, the run function will also be typed with the arguments that the chosen event should receive

Equivalent code with pure discord.js
```ts
client.on("messageUpdate", (oldMessage, newMessage) => {
    // ...
})
```

[Back to the top ↑](#structures)

# How to use Components

About components, the Component class will be used to create the functionality of a fixed component

Import the class from the `src/discord/base` folder, then set the custom id and component type
The components that can be defined in the type property are buttons and any type of select menu

```ts
import { Component } from "@/discord/base";
import { ComponentType } from "discord.js";

new Component({
    customId: "example-component-button",
    type: ComponentType.Button, cache: "cached",
    async run(interaction) {
        interaction.reply({ ephemeral, content: "This is a button component!" });
    },
});
```

```ts
// Commnad code block ===
const channel = interaction.channel as TextChannel;

const embed = new EmbedBuilder({ description: "Welcome to the store" });
const row = createRow(new StringSelectMenuBuilder({
    customId: "store-products-select",
    placeholder: "Select the product",
    options: [
        { label: "Apple", value: "apple", emoji: "🍎" },
        { label: "Melon", value: "melon", emoji: "🍉" },
        { label: "Banana", value: "banana", emoji: "🍌" }
    ]
}));

channel.send({ embeds: [embed], components: [row] });
// ===

new Component({
    customId: "store-products-select",
    type: ComponentType.StringSelect, cache: "cached",
    async run(interaction) {
        const { values:[selected] } = interaction;

        interaction.reply({ ephemeral, content: `You select ${selected}` });
    },
});
```

It is possible to reply multiple components passing a function instead of a string in the customId property
```ts
// User context menu command
new Command({
    name: "Manage user",
    dmPermission,
    type: ApplicationCommandType.User,
    async run(interaction){
        const { targetUser } = interaction;

        const embed = new EmbedBuilder({ description: `Manage ${targetUser}` });
        const row = createRow(
            new ButtonBuilder({ customId: "manage-user-kick", label: "Kick", style: ButtonStyle.Secondary }),
            new ButtonBuilder({ customId: "manage-user-ban", label: "Ban", style: ButtonStyle.Danger }),
            new ButtonBuilder({ customId: "manage-user-timeout", label: "Timeout", style: ButtonStyle.Danger }),
            new ButtonBuilder({ customId: "manage-user-alert", label: "Alert", style: ButtonStyle.Primary })
        );

        interaction.reply({ ephemeral, embeds: [embed], components: [row] });
    }
});
// ===

new Component({
    name: "Manage user buttons",
    customId: id => id.startsWith("manage-user-"),
    type: ComponentType.Button, cache: "cached",
    async run(interaction) {
        const { customId, message, guild } = interaction;
        const action = customId.replace("manage-user-", "");
        const targetMember = await guild.members.fetch(message.embeds[0].footer?.text!);

        switch(action){
            case "kick": {
                targetMember.kick();
                // do things ...
                break;
            }
            case "ban": {
                targetMember.ban();
                // do things ...
                break;
            }
            case "timeout": {
                targetMember.timeout(60000);
                // do things ...
                break;
            }
            case "alert": {
                targetMember.send({ /* ... */ });
                // do things ...
                break;
            }
        }
    },
});
```

[Back to the top ↑](#structures)

# How to use Modals

You can create functionality for modals in the same way as [components](#how-to-use-components);

```ts
import { Modal } from "@/discord/base";

new Modal({
    customId: "announcement-modal",
    cache: "cached",
    run(interaction) {
        const { fields } = interaction;
        const title = fields.getTextInputValue("title-input");

        interaction.reply({ content: title });
    },
});
```

If the modal is opened through a message component, you can set the **ModalMessageModalSubmitInteraction** typing by setting true in the **isFromMessage** property

```ts
new Modal({
    customId: "announcement-modal",
    cache: "cached",
    isFromMessage: true, // Modal opened from button or select menu
    run(interaction) { // ModalMessageModalSubmitInteraction
        const { fields } = interaction;
        const title = fields.getTextInputValue("title-input");

        interaction.update({ content: title, components: [] }); // Update method avaliable
    },
});
```

[Back to the top ↑](#structures)

# Dotenv

You must set your bot's token and other sensitive information in the `.env` file in the project root

_However you may want to use a different env file in development._

If the `.env.development` file exists, **dotenv** will use it to load environment variables. You can use these variables in a development-only environment and when building the project, send the .env file with production variables

[Back to the top ↑](#structures)

# Constants

There are global constants variables that you can use in method or function options objects, also using the "short syntax".

These are variables with the same name as very common properties when we are creating commands and systems for our discord bot. And when we use these properties that are normally optional, we define a default value for them

For example the ephemeral property. This property is often used when we want to make the message private only for the user of the interaction, however, all interaction responses are not ephemeral by default, so most of the time we define the response as ephemeral, this property will be true. On this base we have it as a global variable and we can use it as a "shorthande" in the reply method options object

```ts
interaction.deferReply({ ephemeral }); // ephemeral is true by default;
```

```ts
// src/settings/global.ts
global.ephemeral = true; // Interaction reply/followUp property

declare global {
    var ephemeral: true;
}
```
This way, it is not necessary to import these variables because they are global.

See the constants files in the `src/settings` folder to find out all the constant global variables

[Back to the top ↑](#structures)
