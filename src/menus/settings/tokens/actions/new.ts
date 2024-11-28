import { getDiscordBotInvite } from "#helpers";
import { BotToken } from "#types";
import { log, spinner } from "@clack/prompts";
import Conf from "conf";
import { setTimeout } from "node:timers/promises";

interface Props {
    tokens: BotToken[]; 
    token: string;
    conf: Conf;
}
export async function newTokenAction(props: Props){
    if (props.tokens.some(t => t.token === props.token)){
        log.warn("This token is already saved");
        return;
    }
    
    const fetching = spinner();
    fetching.start("Wait");
    
    const result = await getDiscordBotInvite(props.token);
    
    if (!result.success){
        fetching.stop("The provided token is invalid", 1);
        return;
    }
    const { name, invite, id } = result.data;
    
    props.tokens.push({ name, invite, id, token: props.token });

    props.conf.set("discord.bot.tokens", props.tokens);

    fetching.stop("Token saved successfully!");
    await setTimeout(1200);
}