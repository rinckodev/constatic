import { log, sleep, uiText } from "#helpers";
import { menus } from "#menus";
import { ProgramMenuProps } from "#types";

export async function getDiscordTokens(props: ProgramMenuProps, notCheckAmount=false){
    const tokens = props.conf.get("discord.bot.tokens", []);

    if (!notCheckAmount && !tokens.length){
        log.fail(uiText(props.lang, {
            "en-US": "No tokens to list",
            "pt-BR": "Nenhum token para listar",
        }));
        await sleep(1000);
        menus.settings.tokens.main(props);
        return null;
    }

    return tokens;
}