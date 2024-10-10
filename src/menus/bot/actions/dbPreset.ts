import { BotDatabasePreset } from "#types";
import lodash from "lodash";
import { PackageJson } from "pkg-types";
import { rewriteEnv } from "./rewriteenv.js";
import { copy } from "fs-extra";
import path from "node:path";

interface Props {
    packageJson: PackageJson;
    preset: BotDatabasePreset;
    distPath: string;
    ormIndex: number;
    dbPath: string;
}
export async function setupDbPreset(props: Props){
    lodash.merge(props.packageJson, props.preset.packageJson);

    if (props.preset.env) {
        await rewriteEnv(props.distPath, props.preset.env);
    }
    if (props.preset.isOrm) {
        const ormDb = props.preset.databases[props.ormIndex];

        lodash.merge(props.packageJson, ormDb.packageJson);
        
        await copy(path.join(props.dbPath, ormDb.path), props.distPath);
        if (ormDb.env) {
            await rewriteEnv(props.distPath, ormDb.env);
        }
    } else {
        await copy(path.join(props.dbPath, props.preset.path), props.distPath);
    }
}