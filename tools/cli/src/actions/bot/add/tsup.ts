import merge from "lodash.merge";
import { readPackageJSON, type PackageJson } from "pkg-types";
import { copy } from "fs-extra";
import type { CLI } from "#cli";
import { join } from "node:path";

interface Props {
    pkg: PackageJson,
    distdir: string,
    cli: CLI
}

export async function addBotTsupAction(props: Props) {
    const { pkg, distdir, cli } = props;
    const tsupPackageJson = await readPackageJSON(join(
        cli.templates.botPath,
        "extras/tsup/package.json"
    ));

    merge(pkg, tsupPackageJson);

    await copy(join(
        cli.templates.botPath,
        "extras/tsup/tsup.config.ts"
    ), join(distdir, "tsup.config.ts"));
}