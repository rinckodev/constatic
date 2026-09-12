import { KeyValueFile } from "#lib/kvf.js";
import { type BotServerPreset, program } from "#program";
import merge from "lodash.merge";
import { join } from "node:path";
import type { PackageJson } from "pkg-types";
import type { SourceFile } from "ts-morph";
import { updateEnv } from "../init.js";

interface Props {
    pkg: PackageJson,
    server: BotServerPreset,
    envFile: KeyValueFile,
    envSchema: SourceFile,
    index: SourceFile,
    dist: string,
}

export async function addBotServerAction(props: Props) {
    const { pkg, server, envFile, envSchema, index } = props;
    merge(pkg, server.packageJson);

    if (server.env) {
        await updateEnv(
            envSchema,
            envFile,
            server.env
        );
    }
    if (server.path) {
        await program.fs.copy(join(
            program.templates.path,
            "servers", server.path,
        ), props.dist);
    }

    index.addImportDeclaration({
        moduleSpecifier: "#server"
    });
}