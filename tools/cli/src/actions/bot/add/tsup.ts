import { program } from "#program";
import merge from "lodash.merge";
import { join } from "node:path";
import { readPackageJSON, type PackageJson } from "pkg-types";

interface Props {
    pkg: PackageJson,
    distdir: string
}

export async function addBotTsupAction(props: Props) {
    const { pkg, distdir } = props;
    const tsupPackageJson = await readPackageJSON(join(
        program.templates.path,
        "extras/tsup/package.json"
    ));

    merge(pkg, tsupPackageJson);

    await program.fs.copy(join(
        program.templates.path,
        "extras/tsup/tsup.config.ts"
    ), join(distdir, "tsup.config.ts"));
}