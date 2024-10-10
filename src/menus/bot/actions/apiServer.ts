import { BotAPIServerPreset } from "#types";
import { PackageJson } from "pkg-types";
import lodash from "lodash";
import { rewriteEnv } from "./rewriteenv.js";
import { copy } from "fs-extra";
import path from "node:path";

interface Props {
    preset: BotAPIServerPreset;
    distPath: string;
    apiServersPath: string;
    packageJson: PackageJson;
}
export async function apiServerSetup(props: Props) {
    lodash.merge(props.packageJson, props.preset.packageJson);
    if (props.preset.env){
        await rewriteEnv(props.distPath, props.preset.env);
    }
    await copy(path.join(props.apiServersPath, props.preset.path), props.distPath);  
}