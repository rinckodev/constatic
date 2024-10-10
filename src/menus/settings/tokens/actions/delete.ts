import { BotToken } from "#types";
import { log } from "@clack/prompts";
import Conf from "conf";
import { setTimeout } from "node:timers/promises";

interface Props {
    token: string;
    tokens: BotToken[],
    conf: Conf;
}
export async function deleteTokenAction(props: Props){
    if (props.token === "back") return;

    const filtered = props.tokens.filter(t => t.token !== props.token);
    props.conf.set("discord.bot.tokens", filtered);

    log.success("Token removed successfully!");

    await setTimeout(1200);
}