import { build } from "@constatic/config/build";
import pkg from "./package.json" with { type: "json" };

await build();

const versionFile = Bun.file("./dist/version.js");

const content = await versionFile.text();

await Bun.write(versionFile,
    content.replace("{version}", pkg.version)
);