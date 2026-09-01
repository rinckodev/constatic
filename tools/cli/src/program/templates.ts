import { json } from "#helpers";
import { programroot } from "#root";
import { BotTemplateProperties } from "#types";
import { join } from "node:path";

const path = join(programroot, "templates/discord/bot");
const props = await json.read<BotTemplateProperties>(
    join(path, "properties.json")
);

export const programTemplates = Object.freeze({
    path, props
});