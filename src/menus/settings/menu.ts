import ck from "chalk";
import { actionsPrompt } from "./prompts/actions.js";
import { menus } from "#menus";
import { ProgramMenuProps } from "#types";

export async function settingsMenu(props: ProgramMenuProps){
    const title = ck.cyan.underline("❑ Settings menu");
    const action = await actionsPrompt(title);

    switch(action){
        case "bot-tokens":{
            menus.settings.tokens(props);
            return;
        }
        case "main":{
            menus.main(props);
            return;
        }
    }
}