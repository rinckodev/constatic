import { messages } from "#helpers";
import { menus } from "#menus";
import { ProgramMenuProps } from "#types";
import ck from "chalk";
import { actionsPrompt } from "./prompts/actions.js";
import * as clack from "@clack/prompts";

export async function mainMenu(props: ProgramMenuProps){
    const title = ck.cyan.underline("❑ Main menu");
    const action = await actionsPrompt(title);

    switch(action){
        case "bot-init":{
            menus.bot(props);
            return;
        }
        case "settings":{
            menus.settings.main(props);
            return;
        }
        case "quit":{
            clack.outro(messages.bye);
            process.exit(0);
        }
    }
}