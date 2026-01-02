import merge from "lodash.merge";
import type { BotServerPreset } from "#types";
import type { PackageJson } from "pkg-types";
import type { SourceFile } from "ts-morph";
import { updateEnv } from "../init.js";
import { copy } from "fs-extra";
import { CLI } from "#cli";
import { join } from "node:path";
import { KeyValueFile } from "#lib/kvf.js";

interface Props {
    pkg: PackageJson,
    server: BotServerPreset,
    envFile: KeyValueFile,
    envSchema: SourceFile,
    index: SourceFile,
    dist: string,
    cli: CLI,
}

export async function addBotServerAction(props: Props) {
    const { cli, pkg, server, envFile, envSchema, index } = props;
    merge(pkg, server.packageJson);

    if (server.env) {
        await updateEnv(
            envSchema,
            envFile,
            server.env
        );
    }
    if (server.path) {
        await copy(join(
            cli.templates.botPath,
            "servers", server.path,
        ), props.dist);
    }

    index.addImportDeclaration({
        moduleSpecifier: "#server"
    });
}