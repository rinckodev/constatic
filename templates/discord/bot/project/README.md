# Awesome Bot Base

* This project can be generated using the [Constant CLI](https://github.com/rinckodev/constatic)

This is the most complete discord bot base you've ever seen! Developed by [@rinckodev](https://github.com/rinckodev), this project uses typescript in an incredible way to provide complete structures and facilitate the development of your discord bot.

> ⚠️ [NodeJs](https://nodejs.org/en) version required: 20.12 or higher 

## Scripts

- `dev`: running bot in development
- `build`: build the project,
- `watch`: running in watch mode
- `start`: running the compiled bot

## Structures

- [Commands](#commands)
    - [Slash](#slash-commands)
    - [Context menu](#context-menu)
    - [Autocomplete](#autocomplete)
- [Responder](#responder)
    - [Buttons](#buttons)
    - [Select menus](#select-menus)
    - [Modals](#modals)
- [Events](#events)

## Features
- [Custom Id Params](#custom-id-params)
- [Store](#store)
- [Cooldown](#cooldown)
- [URLStore](#urlstore)
- [ES6 Modules](#es6-modules)
- [Path aliases](#path-aliases)
- [Global vars](#global-vars)
- [Env file](#env-file)

# Commands

To create a command, you need to import the `Command` class from the base and `ApplicationCommandType` enum from discord.js
```ts
import { Command } from "#base";
import { ApplicationCommandType } from "discord.js";
```

You can create `slash`, `message context`, and `user context` commands.

The typing of the `run method` is defined according to the type of command.

[Back to the top ↑](#structures)

## Slash commands
To create a slash command, you need to set name, description and type.

```ts
new Command({
    name: "hello",
    description: "Hello world command",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        interaction.reply({ ephemeral, content: "Hello world!" });
    },
});
```
You can set options, subcommands and groups too
```ts
import { Command } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

new Command({
    name: "manage",
    description: "Manage command",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "users",
            description: "Manage users command",
            type: ApplicationCommandOptionType.Subcommand
            options: [
                {
                    name: "user",
                    description: "user",
                    type: ApplicationCommandOptionType.User
                    required
                }       
            ],
        }
    ],
    async run(interaction) {
        const { options } = interaction;

        switch(options.getSubcommand(true)){
            case "users":{
                const user = options.getUser("user", true);
                interaction.reply({ ephemeral, content: `${user} managed` })
                return;
            }
        }
    },
});
```

[Back to the top ↑](#structures)

## Context menu

To create a user context menu command, you need to set name and type.

```ts
new Command({
    name: "profile",
    type: ApplicationCommandType.User,
    async run(interaction) {
        const { targetUser } = interaction;
        interaction.reply({ ephemeral, content: `${targetUser}'s profile` });
    },
});
```

To create a message context menu command, you need to set name and type.

```ts
new Command({
    name: "reply",
    type: ApplicationCommandType.Message,
    async run(interaction) {
        const { targetMessage } = interaction;
        interaction.deferReply({ ephemeral });
        targetMessage.reply("Hi!");
    },
});
```

[Back to the top ↑](#structures)

## Autocomplete

You can create an autocomplete option in your command and respond to it using the autocomplete method above run

```ts
new Command({
	name: "search",
	description: "Search command",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "query",
			description: "Query",
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required,
		}
	],
	async autocomplete(interaction) {
		const focused = interaction.options.getFocused();
		const results = await searchData(focused);
		if (results.length < 1) return;
		const choices = results.map(data => ({
			name: data.title, value: data.url
		}));
		interaction.respond(choices.slice(0, 25));
	},
	async run(interaction){
		const { options } = interaction;

		const query = options.getString("query", true);
		
		interaction.reply({ ephemeral, content: query });
	}
});
```

If you have a large number of items, use autocomplete to try to find it

```ts
new Command({
    // ...
    async autocomplete(interaction) {
		const { options, guild } = interaction;

        const focused = options.getFocused();
        const documents = await db.get(guild.id);

        const filtered = documents.filter(
            data => data.address.toLowercase().includes(focused.toLowercase())
        )
        if (filtered.length < 1) return;
        const choices = filtered.map(data => ({
			name: data.title, value: data.url
		}));
		interaction.respond(choices.slice(0, 25));
	},
    // ...
})
```

[Back to the top ↑](#structures)

# Responder

Responder is a powerful class to deal with different types of interactions, with it we can respond to buttons, select menus and modals or all at the same time

See the simple example below, let's send a button through a command and reply to it using the "Responder" class

```ts
import { Command, Responder, ResponderType } from "#base";
import { createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle } from "discord.js";

new Command({
    name: "ping",
    description: "Ping command",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const row = createRow(
            new ButtonBuilder({
                customId: "ping/button", 
                label: "Ping", 
                style: ButtonStyle.Success
            })
        );
        interaction.reply({ ephemeral, components: [row] });
    }
});

new Responder({
    customId: "ping/button",
    type: ResponderType.Button, cache: "cached",
    async run(interaction) {
        interaction.reply({ ephemeral, content: "pong" });
    },
});
```

[Back to the top ↑](#structures)

## Buttons

Reply to a button by setting the Responder type as button

```ts
// ...
const row = createRow(
    new ButtonBuilder({
        customId: "confirm/button", 
        label: "Confirm", 
        style: ButtonStyle.Success
    })
);
interaction.reply({ ephemeral, components: [row] });
// ...

new Responder({
    customId: "confirm/button",
    type: ResponderType.Button, cache: "cached",
    async run(interaction) {
        interaction.update({ ephemeral, content: "Confirmed", components: [] });
    },
});
```

[Back to the top ↑](#structures)

## Select menus
Reply to a button by setting the Responder type as select

```ts
// ...
const row = createRow(
    new StringSelectMenuBuilder({
        customId: "select/fruits",
        placeholder: "Select fruits",
        options: [
            { emoji: "🍎", label: "Apple", value: "apple" },
            { emoji: "🍉", label: "Melon", value: "melon" },
            { emoji: "🍊", label: "Orange", value: "orange" }
        ]
    })
);
interaction.reply({ ephemeral, components: [row] });
// ...

new Responder({
    customId: "select/fruits",
    type: ResponderType.StringSelect, cache: "cached",
    async run(interaction) {
        const selected = interaction.values[0];
        interaction.update({ ephemeral, content: `${selected} selected`, components: [] });
    },
});
```

[Back to the top ↑](#structures)

## Modals
Reply to a modal by setting the Responder type as modal

```ts
// ...
interaction.showModal({
    customId: "form/modal",
    title: "Form",
    components: createModalFields({
        name:{
            label: "What's your name?",
            style: TextInputStyle.Short
        },
        age:{
            label: "What's your age?",
            style: TextInputStyle.Short
        },
    })
});
// ...

new Responder({
    customId: "form/modal",
    type: ResponderType.Modal, cache: "cached",
    async run(interaction) {
        const { fields, member } = interaction;
        const name = fields.getTextInputValue("name");
        const age = fields.getTextInputValue("age");

        await registerMember(member, { name, age });

        interaction.reply({ ephemeral, content: `Registered as ${name}` });
    },
});
```

[Back to the top ↑](#structures)

# Events

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

All discord events are typed in the "event" property, when choosing an event, the run function will also be typed with the arguments that the chosen event should receive

[Back to the top ↑](#structures)

## Custom Id Params

You can use a feature from this base named "Custom Id Params" to reply any component or modal dynamically, see:

```ts
// User context menu command
new Command({
    name: "Manage user",
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
new Responder({
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

* You can use this feature with all responder types, but don't forget that discord has a 100 character limit on the custom id

[Back to the top ↑](#features)

## Store

The Store class works the same as Map, but it is possible to define a time for the item to be deleted
```ts
const tempUser = new Store<string>();

tempUser.set(user.id, "code", { time: 30000 });
console.log(tempUser.get(user.id)) // "code";

await sleep(40000);
console.log(tempUser.get(user.id)) // undefined;
```


This class is useful for storing items temporarily, you can set a default time when creating the Store

```ts
const blockedStore = new Store<boolean>({ clearTime: 20000 });

blockedStore.set(message.id, true);
console.log(blockedStore.get(message.id)) // true;

await sleep(25000);
console.log(blockedStore.get(message.id)) // undefined;
```

It is possible to set a function to be executed before the item is deleted

```ts
const tempMessage = new Store<boolean>({ clearTime: 20000 });

tempMessage.set(message.id, true, {
    beforeEnd(){
        console.log(message.id, "deleted");
    },
});

await sleep(25000);
// "123456789 deleted"
```

[Back to the top ↑](#features)

## Cooldown

Manipulate a date with the Cooldown class, perfect for creating expiration dates for anything

```ts
const cooldown = new Cooldown();
console.log(cooldown.expiresAt.toTimeString()); // 14:18:00
cooldown.add(30, "minutes");
console.log(cooldown.expiresAt.toTimeString()); // 14:48:00
cooldown.remove(20, "minutes");
console.log(cooldown.expiresAt.toTimeString()); // 14:28:00
```

The `add` and `remove` methods allow you to manipulate the date time easily.
You can set a value with the following time units: milliseconds, seconds, minutes, hours, days

[Back to the top ↑](#features)

## URL Store

Use the URLStore class to store simple form data in a url, which can be sent in a discord message and retrieved again later

```ts
import { Command, Responder, ResponderType, URLStore } from "#base";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle } from "discord.js";

new Command({
    name: "setup",
    description: "setup command",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "channel",
            description: "select a channel",
            type: ApplicationCommandOptionType.Channel,
            required
        }
    ],
    async run(interaction){
        const { options } = interaction;

        const channel = options.getChannel("channel", true);
        const urlStore = new URLStore();
        urlStore.set("channelId", channel.id);

        const embed = createEmbed({
            url: urlStore.toString(),
            description: brBuilder(
                "# Panel",
                "- View Channel"
            )
        });

        const row = createRow(
            new ButtonBuilder({
                customId: "panel/channel", 
                label: "View channel", 
                style: ButtonStyle.Success
            })
        );

        interaction.reply({ embeds: [embed], components: [row] });
    }
});

new Responder({
    customId: "panel/:context",
    type: ResponderType.Button, cache: "cached",
    async run(interaction, { context}) {
        const { guild } = interaction;
        const embed = createEmbed({ from: interaction });
        const urlStore = new URLStore(embed.data.url);

        switch(context){
            case "channel":{
                const channelId = urlStore.get("channelId")!;
                const channel = guild.channels.cache.get(channelId);
                interaction.reply({ ephemeral, content: `${channel ?? "not found"}` });
                return;
            }
        }
    },
});
```

> ⚠️ Discord has a limit of 2048 characters in urls in embeds, so it is not possible to store much information this way, the ideal would be a database, but for simple data this class is very useful

[Back to the top ↑](#features)

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
export * from "./math/mycustumfunc.js"
```
Create an index file in the folders that have an alias in the tsconfig file

```ts
// src/commands/public/ping.ts
import { sum } from "#functions"
```
[Back to the top ↑](#features)

## Path aliases

Path aliases are a way of organizing imports in your code, instead of using a relative path, we can set in package.json, aliases for certain paths.

```js
// package.json
{
  "name": "awesome-bot-base",
  "type": "module",
  //..
  "imports": {
    "#base": ["./dist/discord/base/index.js"],
    //..
  }
}
```
```js
// tsconfig.json
{
	"compilerOptions": {
        //..
		"baseUrl": "./src",
		"paths": {
			"#base": ["./discord/base/index.ts"],
		},
	},
}
```
With this we can import anything that was exported from the index file of this path, anywhere in our project

```ts
// src/discord/base/index.ts
export * from "./App.js";
export * from "./Command.js";
export * from "./Event.js";
export * from "./Responder.js";

export * from "./utils/Store.js";
export * from "./utils/URLStore.js";
export * from "./utils/Cooldown.js";
```

```ts
// src/discord/commands/public/ping.ts
import { Command } from "#base";
// import { Command } from "../../base/Command.js";
```
```ts
// src/functions/utils/cooldown/create.ts
import { Cooldown } from "#base";
// import { Cooldown } from "../../../discord/base/utils/Cooldown.js";

```
```ts
// src/discord/commands/private/context/manage.ts
import { Command } from "#base";
import { settings } from "#settings";
// import { Command } from "../../../base/Command.js";
// import { settings } from "../../../../settings/index.js";
```

[Back to the top ↑](#features)

## Global vars

There are global constants variables that you can use in method or function options objects, also using the "short syntax".

These are variables with the same name as very common properties when we are creating commands and systems for our discord bot. And when we use these properties that are normally optional, we define a default value for them

For example the ephemeral property. This property is often used when we want to make the message private only for the user of the interaction, however, all interaction responses are not ephemeral by default, so most of the time we define the response as ephemeral, this property will be true. On this base we have it as a global variable and we can use it as a "short syntax" in the reply method options object

```ts
interaction.deferReply({ ephemeral }); // ephemeral is true by default;
```

```ts
// src/settings/global.ts
Object.assign(globalThis, { 
    ephemeral: true // Interaction reply/followUp property
    // ...
}); 

declare global {
    var ephemeral: true;
    // ...
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