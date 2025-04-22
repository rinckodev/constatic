import { cliTheme, commonTexts, divider, uiText } from "#helpers";
import { menus } from "#menus";
import { ProgramMenuProps } from "#types";
import { select } from "@inquirer/prompts";
import ck from "chalk";

export async function settingsTokensMenu(props: ProgramMenuProps){

    const action = await select({
        message: uiText(props.lang, {
            "pt-BR": "❑ Gerenciar tokens",
            "en-US": "❑ Manage tokens",
        }, ck.reset.cyan.underline),
        theme: cliTheme,
        choices: [
            { 
                name: uiText(props.lang, {
                    "en-US": "☰ List tokens",
                    "pt-BR": "☰ Listar tokens",
                }, ck.blue),
                value: "list" 
            },
            { 
                name: uiText(props.lang, {
                    "en-US": "✦ New token",
                    "pt-BR": "✦ Novo token",
                }, ck.green),
                value: "new" 
            },
            { 
                name: uiText(props.lang, {
                    "en-US": "✗ Delete tokens",
                    "pt-BR": "✗ Excluir tokens",
                }, ck.red),
                value: "delete" 
            },
            {
                name: commonTexts(props.lang).back,
                value: "back" 
            },
        ]
    });
    divider();

    switch(action){
        case "list":{
            menus.settings.tokens.list(props);
            return;
        }
        case "new":{
            menus.settings.tokens.new(props);
            return;
        }
        case "delete":{
            menus.settings.tokens.delete(props);
            return;
        }
        case "back":{
            menus.main(props);
            return;
        }
    }

}