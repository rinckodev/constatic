import { APIEmoji } from "#shared/emojis.js";
import { Result } from "#utils/result.js";
import { writeFile } from "node:fs/promises";

interface EmojisFileActionProps {
    emojis: APIEmoji[],
    type: "url" | "id",
    dist: string
}

export async function emojisFileAction(props: EmojisFileActionProps){
    const toRecord = (acc: Record<string, string>, emoji:APIEmoji) => {
        acc[emoji.name] = props.type === "url"
            ? toEmojiURL(emoji.id, emoji.animated)
            : emoji.id
        return acc;
    };
    const data = {
        static: props.emojis.filter(e => !e.animated).reduce(toRecord, {}),
        animated: props.emojis.filter(e => e.animated).reduce(toRecord, {})
    };

    return writeFile(props.dist, JSON.stringify(data, null, 2), "utf-8")
        .then(() => Result.ok("File written successfully!"))
        .catch((err) => Result.fail(err.message))
}

function toEmojiURL(emojiId: string, animated=false){
    const ext = animated ? "gif" : "png";
    return `https://cdn.discordapp.com/emojis/${emojiId}.${ext}`;
};