import { api } from "#shared/api.js";
import { APIEmoji } from "#shared/emojis.js";
import { DiscordBotToken } from "#shared/token.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";

interface EmojisDeleteActionProps {
    token: DiscordBotToken,
    emojis: APIEmoji[],
}
export async function emojisDeleteAction(props: EmojisDeleteActionProps) {
    const { emojis, token } = props;

    await Promise.all(
        emojis.map(async emoji => {
            const name = ck.yellow.underline(emoji.name);

            const deleteResult = await api.emojis.delete(token, emoji.id);
            if (!deleteResult.success){
                log.fail(`Could not delete the emoji ${name}: ${deleteResult.error}`);
                return;
            }
            log.custom(ck.red(log.icon.success),
                `${ck.red.bgRed("Deleted")} → ${name}`
            );
        })
    );
}