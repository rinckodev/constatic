#!/usr/bin/env node
import { intro, log } from "@clack/prompts";
import ck from "chalk";
import { runMain } from "citty";
import Conf from "conf";
import path from "node:path";
import packageJson from "../package.json" with { type: "json" };
import { menus } from "./menus/index.js";

if (process.versions.node < "20.11"){
    log.error("Required node version: 20.11 or higher");
    console.log(`Your node version: ${process.versions.node}`);
    process.exit(1);
}

const rootname = path.join(import.meta.dirname, "..");
const conf = new Conf({ projectName: packageJson.name });
const cwd = process.cwd();

intro(`💎 ${ck.blue("Constatic CLI")} 📦 ${ck.dim.underline(packageJson.version)}`);

runMain({
    meta: {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
    },
    async run() {
        menus.program.main({ rootname, conf, cwd });
    },
});

declare global {
    interface ProgramProps {
        readonly rootname: string;
        readonly conf: Conf;
        readonly cwd: string;
    }

    interface BotEnviroment {
        schema: string;
        file: string;
    }

    interface BotProjectPreset {
        name: string; hint: string; emoji: string; 
        dependencies: Record<string, string>;
        devDependencies?: Record<string, string>;
        env?: BotEnviroment;
        disabled?: boolean;
    }
    interface BotAPIServerPreset extends BotProjectPreset {
        path: string;
    }
    interface BotLibDatabasePreset extends BotProjectPreset {
        isOrm: false;
        path: string;
    }
    interface BotOrmDatabasePreset extends BotProjectPreset {
        isOrm: true;
        databases: BotLibDatabasePreset[];
    }
    type BotDatabasePreset = BotLibDatabasePreset | BotOrmDatabasePreset;

    interface BotProperties {
        dbpresets: BotDatabasePreset[],
        apiservers: BotAPIServerPreset[]
    }
    interface BotToken {
        name: string; token: string;
        invite: string; id: string;
    }
}