# Awesome Bot Base
* [This project was generated using Constatic CLI](https://github.com/rinckodev/constatic)

This is the most complete bot base you've ever seen! Created by [@rinckodev](https://github.com/rinckodev). This project uses typescript to its advantage, using features to create complete structures that facilitate the construction of commands and systems

> ⚠️ Node version required: 21.5 or higher 

## Scripts

- `dev`: running bot in development
- `build`: build the project
- `watch`: running in watch mode
- `start`: running the builded bot

## Structures

See how to use:
- [Commands](#how-to-use-commands)
- [Store](#store)
- [Components](#how-to-use-components)
- [Custom Id Params](#custom-id-params)
- [Modals](#how-to-use-modals)
- [Events](#how-to-use-events)

## Features
- [ES6 Modules](#es6-modules)
- [Constants](#constants)
- [Env file](#env-file)

## How to use Commands 

To create a new command, import the Command class from the `src/discord/base` folder. All commands must be created in the `src/discord/commands` folder or subfolders of the commands folder

- Use import alias `#base` 

You can create slash **commands**, **user** and **message** context menus

The run method interaction typing is defined according to the command type

```ts
import { ApplicationCommandType } from "discord.js";
import { Command } from "#base";

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
    name: "Say hello",
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

## Store

You can use the **Store** structure to temporarily store information in a command. When creating a new Store you can set the default time and whether items are deleted by default.

```ts
import { Command, Store } from "#base";
import { ApplicationCommandType, time} from "discord.js";

new Command({
    name: "mine",
    description: "Mine command",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    store: {
        cooldowns: new Store<Date>({ clearTime: 60000 })
    },
    async run(interaction, store){
        const now = new Date();
        const cooldown = store.cooldowns.get(interaction.member.id) ?? now;

        if (cooldown > now){
            interaction.reply({ ephemeral, 
                content: `You will be able to mine again ${time(cooldown, "R")}` 
            });
            return;
        }

        interaction.reply({ ephemeral, content: `You mine!` });

        now.setSeconds(now.getSeconds() + 60);

        store.cooldowns.set(interaction.member.id, now);
    }
});
```
After using the **set** method, the defined value will be deleted after the time defined when creating this **Store**

This way you don't have to worry about defining a **setTimeout** function. This is supposed to be temporary, do not store information that should be persistent. The Store works like a map, if the bot restarts, everything will be lost

As the third argument of the set method, you can define a time in milliseconds different from the one defined when creating the Store
```ts
async run(interaction, { cooldowns }){
    const { member } = interaction; 
    cooldowns.set(member.id, now, 80000);
}
```
Or if you prefer, you can choose not to delete the data stored in this key
```ts
cooldowns.set(member.id, now, null);
```
As a last argument you can define a callback that will be executed when the value is deleted
```ts
cooldowns.set(member.id, now, cooldowns.defaultClearTime, (value) => {
    console.log("Value deleted", value);
});
```

There are many uses for this structure, you can use it anywhere in your code, but it is recommended to use it in this command context. 

You can get the **Store** from a command anywhere
```ts
//     \/   Assign the command to a variable
const command = new Command({
	name: "apply",
	description: "Apply form",
	type: ApplicationCommandType.ChatInput,
	dmPermission: false,
	store: {
		cooldowns: new Store<Date>({ clearTime: 60000 })
	},
	run(interaction, { cooldowns }) {
		const now = new Date();
        const cooldown = cooldowns.get(interaction.member.id) ?? now;

        if (cooldown > now){
            interaction.reply({ ephemeral, 
                content: `You will be able to mine again ${time(cooldown, "R")}` 
            });
            return;
        }

		interaction.showModal({
			customId: "form/modal",
			// ...
		});
	},
});

new Modal({
	customId: "form/modal",
	cache: "cached",
	run(interaction) {
		const { fields, member } = interaction;
	
		const name = fields.getTextInputValue("name/input");
		const age = fields.getTextInputValue("age/input");
		const bio = fields.getTextInputValue("bio/input");
		
		// do things ...

		// end
		const future = new Date();
		future.setSeconds(future.getSeconds() + 60);

		command.store.cooldowns.set(member.id, future);
        // /\ In the same file you can use other structures and access the command store and modify values in it
	},
});
```

If you have separate structures in other files, just export the command

```ts
export const applyCommand = new Command({
    // ...
})
```
```ts
import { applyCommand } from "../../commands/public/apply.js"

new Modal({
	customId: "form/modal",
	cache: "cached",
	run(interaction) {]
        // ...
		const future = new Date();
		future.setSeconds(future.getSeconds() + 60);

		applyCommand.store.cooldowns.set(member.id, future);
	},
});
```

[Back to the top ↑](#structures)

## How to use Components

About components, the Component class will be used to create the functionality of a fixed component

Import the class from the `src/discord/base` folder, then set the custom id and component type
The components that can be defined in the type property are buttons and any type of select menu

```ts
import { ComponentType } from "discord.js";
import { Component } from "#base";

new Component({
    customId: "example-component-button",
    type: ComponentType.Button, cache: "cached",
    async run(interaction) {
        interaction.reply({ ephemeral, content: "This is a button component!" });
    },
});
```

```ts
// Command code block 
const channel = interaction.channel as TextChannel;

const embed = new EmbedBuilder({ description: "Welcome to the store" });
const row = createRow(
    new StringSelectMenuBuilder({
        customId: "store/products/select",
        placeholder: "Select the product",
        options: [
            { label: "Apple", value: "apple", emoji: "🍎" },
            { label: "Melon", value: "melon", emoji: "🍉" },
            { label: "Banana", value: "banana", emoji: "🍌" }
        ]
    })
);

channel.send({ embeds: [embed], components: [row] });
// ===

new Component({
    customId: "store/products/select",
    type: ComponentType.StringSelect, cache: "cached",
    async run(interaction) {
        const { values:[selected] } = interaction;

        interaction.reply({ ephemeral, content: `You select ${selected}` });
    },
});
```
[Back to the top ↑](#structures)

## Custom Id Params

You can use a feature from this base named "Custom Id Params" to respond to components dynamically, see:
```ts
// User context menu command
new Command({
    name: "Manage user",
    dmPermission: false,
    type: ApplicationCommandType.User,
    async run(interaction){
        const { targetUser } = interaction;

        const embed = new EmbedBuilder({ description: `Manage ${targetUser}` });
        const row = createRow(
            new ButtonBuilder({ 
                customId: `manage/user/${targetUser.id}/kick`, 
                label: "Kick", style: ButtonStyle.Secondary 
            }),
            new ButtonBuilder({ 
                customId: `manage/user/${targetUser.id}/ban`, 
                label: "Ban", style: ButtonStyle.Danger 
            }),
            new ButtonBuilder({ 
                customId: `manage/user/${targetUser.id}/timeout`, 
                label: "Timeout", style: ButtonStyle.Danger 
            }),
            new ButtonBuilder({ 
                customId: `manage/user/${targetUser.id}/alert`, 
                label: "Alert", style: ButtonStyle.Primary 
            })
        );

        interaction.reply({ ephemeral, embeds: [embed], components: [row] });
    }
});

// Dynamic button component function
new Component({
    customId: "manage/user/:userId/:action",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, params) {
        const { action, userId } = params;
        const targetMember = await interaction.guild.members.fetch(userId);

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

## How to use Modals

You can create functionality for modals in the same way as [components](#how-to-use-components);

```ts
import { Modal } from "#base";

new Modal({
    customId: "announcement/modal",
    cache: "cached",
    run(interaction) {
        const { fields } = interaction;
        const title = fields.getTextInputValue("title-input");

        interaction.reply({ content: title });
    },
});
```

If the modal is opened through a message component, you can set the **ModalMessageModalSubmitInteraction** typing by setting true in the **isFromMessage** property. 

```ts
new Modal({
    customId: "announcement/modal",
    cache: "cached",
    isFromMessage: true, // Modal opened from button or select menu
    run(interaction) { // ModalMessageModalSubmitInteraction
        const { fields } = interaction;
        const title = fields.getTextInputValue("title-input");

        interaction.update({ content: title, components: [] }); // Update method avaliable
    },
});
```
- You can also use "Custom Id Params" with modals

[Back to the top ↑](#structures)

## How to use Events

To create a listener for a discord.js event, use the Event class from the `src/discord/base` folder

```ts
import { Event } from "#base";

new Event({
    name: "Message edit logs",
    event: "messageUpdate",
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

## ES6 Modules

> ⚠️ This base uses the `"type": "module"` in [package.json](./package.json). It is important to remember to use the `.js` extension when importing relative paths (even if they are typescript files).

```ts
// src/functions/math/mycustumfunc.ts
export function sum(a: number, b: number){
    return a + b;
}
```
```ts
// src/functions/index.ts
export * from "./math/mycustumfunc.ts"
```
Create an index file in the folders that have an alias in the tsconfig file

```ts
// src/commands/public/ping.ts
import { sum } from "#functions"
```
[Back to the top ↑](#features)

## Constants

There are global constants variables that you can use in method or function options objects, also using the "short syntax".

These are variables with the same name as very common properties when we are creating commands and systems for our discord bot. And when we use these properties that are normally optional, we define a default value for them

For example the ephemeral property. This property is often used when we want to make the message private only for the user of the interaction, however, all interaction responses are not ephemeral by default, so most of the time we define the response as ephemeral, this property will be true. On this base we have it as a global variable and we can use it as a "short syntax" in the reply method options object

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

[Back to the top ↑](#features)

## Env file

With the new versions of node we now use the **--env-file** flag to indicate an environment variable file for our project

```bash
node --env-file .env ./dist/index.js
```

You can have two env files in your project and choose which one to use using predefined scripts
```json
{
    "dev": "tsx --env-file .env ./src/index.ts",
    "dev:dev": "tsx --env-file .env.development ./src/index.ts",
}
```
If you have a `.env.development` file you can run the **dev:dev** script
```bash
npm run dev:dev
```
This is the same for all other scripts
```bash
npm run start:dev
npm run watch:dev
```

[Back to the top ↑](#features)
