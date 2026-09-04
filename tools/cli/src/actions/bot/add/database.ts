import { KeyValueFile } from "#lib/kvf.js";
import { type BotDatabasePreset, program } from "#program";
import { copy } from "fs-extra";
import merge from "lodash.merge";
import { join } from "node:path";
import type { PackageJson } from "pkg-types";
import type { SourceFile } from "ts-morph";
import { updateEnv } from "../init.js";

interface Props {
    pkg: PackageJson,
    database: BotDatabasePreset,
    envFile: KeyValueFile,
    envSchema: SourceFile,
    dist: string,
}

export async function addBotDatabaseAction(props: Props) {
    const { pkg, database, envFile: envManager, envSchema } = props;
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
            program.templates.path,
            "databases", database.path,
        ), props.dist);
    }
}