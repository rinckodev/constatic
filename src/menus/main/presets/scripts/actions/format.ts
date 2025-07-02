import { commonTexts } from "#helpers";
import { ScriptPreset, ScriptPresetFile } from "#types";
import ck from "chalk";

export function formatPresets(presets: ScriptPreset[], withoutback?: boolean) {
    const formated = presets.map(({ id, name }) => ({
        name: ck.blue(`🗐 ${name}`), value: id
    }));
    if (!withoutback){
        formated.unshift({
            name: commonTexts.back,
            value: "back"
        });
    }
    return formated;
}

export function formatPresetFiles(files: ScriptPresetFile[]){
    return files.map(({ path, dist=path }) => ({
        name: path, value: dist
    }))
}