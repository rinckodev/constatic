#!/usr/bin/env node
import packageJson from "../package.json" with { type: "json" };
import path from "node:path";
import { log } from "@clack/prompts";
import Conf from "conf";
import { runMain } from "citty";
import { menus } from "./menus/index.js";

if (process.versions.node < "20.11"){
    log.error("Required node version: 20.11 or higher");
    console.log(`Your node version: ${process.versions.node}`);
    process.exit(1);
}

const rootname = path.join(import.meta.dirname, "..");
const conf = new Conf({ projectName: packageJson.name });
const cwd = process.cwd();

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

    interface BotDatabaseProps {
        name: string; hint: string; emoji: string; 
        dependencies: Record<string, string>;
        envSchema?: string;
        disabled?: boolean;
    }
    interface BotLibDatabasePreset extends BotDatabaseProps {
        isOrm: false;
        path: string;
    }
    interface BotOrmDatabasePreset extends BotDatabaseProps {
        isOrm: true;
        databases: BotLibDatabasePreset[];
    }
    type BotDatabasePreset = BotLibDatabasePreset | BotOrmDatabasePreset;

    interface BotProperties {
        dbpresets: BotDatabasePreset[]
    }
    interface BotToken {
        name: string; token: string;
        invite: string; id: string;
    }
}