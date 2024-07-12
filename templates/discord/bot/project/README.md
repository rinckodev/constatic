# Awesome Bot Base

* This project can be generated using the [Constant CLI](https://github.com/rinckodev/constatic)

See the full documentation for this base by accessing: https://constatic-docs.vercel.app/discord

This is the most complete discord bot base you've ever seen! Developed by [@rinckodev](https://github.com/rinckodev), this project uses typescript in an incredible way to provide complete structures and facilitate the development of your discord bot.

> ⚠️ [NodeJs](https://nodejs.org/en) version required: 20.12 or higher 

## Scripts

- `dev`: running bot in development
- `build`: build the project,
- `watch`: running in watch mode
- `start`: running the compiled bot

## Structures

- [Commands](https://constatic-docs.vercel.app/discord/commands)
    - [Slash](https://constatic-docs.vercel.app/discord/commands/slash)
    - [Context menu](https://constatic-docs.vercel.app/discord/commands/context)
    - [Autocomplete](https://constatic-docs.vercel.app/discord/commands/autocomplete)
- [Responder](https://constatic-docs.vercel.app/discord/responders)
    - [Buttons](https://constatic-docs.vercel.app/discord/responders/buttons)
    - [Select menus](https://constatic-docs.vercel.app/discord/responders/selects)
    - [Modals](https://constatic-docs.vercel.app/discord/responders/modals)
- [Events](https://constatic-docs.vercel.app/discord/events)

## Features
- [Custom Id Params](https://constatic-docs.vercel.app/discord/responders/params)
- [Store](#store)
- [Cooldown](#cooldown)
- [URLStore](#urlstore)

* More features in https://constatic-docs.vercel.app/discord/conventions

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