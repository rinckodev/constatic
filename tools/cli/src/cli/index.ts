import { cliLang } from "#helpers";
import { Language } from "#types";
import { PackageJson, readPackageJSON } from "pkg-types";
import { CLIConfig } from "./config.js";
import { CLIShell } from "./shell.js";
import path from "node:path";
import { CLITemplates } from "./templates.js";
import { CLIFileSystem } from "./fs.js";

export class CLI {
    public static async init(rootname: string) {
        const packageJson = await readPackageJSON(
            path.join(rootname, "package.json")
        );
        const cli = new this(rootname, packageJson);
        await cli.templates.load();
        return cli;
    }
    readonly pkg: PackageJson & { version: string };
    readonly config: CLIConfig;
    readonly shell: CLIShell;
    readonly templates: CLITemplates;
    readonly fs: CLIFileSystem;
    public get lang(): Language {
        return cliLang.get()
    }
    readonly rootname: string;
    private constructor(rootname: string, pkg: PackageJson) {
        this.pkg = { ...pkg, version: pkg.version ?? "0.0.0" };
        this.config = CLIConfig.init(this.pkg.name);
        this.rootname = rootname;
        this.shell = new CLIShell();
        this.templates = new CLITemplates(rootname);
        this.fs = new CLIFileSystem();
    }
}