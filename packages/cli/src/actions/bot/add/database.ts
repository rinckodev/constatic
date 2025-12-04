import merge from "lodash.merge";
import type { BotDatabasePreset } from "#types";
import type { PackageJson } from "pkg-types";
import type { SourceFile } from "ts-morph";
import { updateEnv } from "../init.js";
import { copy } from "fs-extra";
import type { CLI } from "#cli";
import { join } from "node:path";
import { KeyValueFile } from "#lib/kvf.js";

interface Props {
    pkg: PackageJson,
    database: BotDatabasePreset,
    envFile: KeyValueFile,
    envSchema: SourceFile,
    cli: CLI,
    dist: string,
}

export async function addBotDatabaseAction(props: Props) {
    const { cli, pkg, database, envFile: envManager, envSchema } = props;
    merge(pkg, database.packageJson);

    if (database.env) {
        await updateEnv(
            envSchema,
            envManager,
            database.env
        );
    }
    if (database.path) {
        await copy(join(
            cli.templates.botPath,
            "databases", database.path,
        ), props.dist);
    }
}