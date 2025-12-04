import { Result } from "#lib/result.js";
import type { NpmPackage } from "#types";
import path from "node:path";
import { uiMessage } from "../ui.js";

const baseURL = "https://registry.npmjs.org";

export async function fetchNpmPackage(lib: string) {
    const regex = /^(?<name>@?[^@\/]+(?:\/[^@]+)?)(?:@(?<version>.+))?$/;

    const match = lib.match(regex);
    const name = match?.groups?.name;
    const version = match?.groups?.version ?? "latest";

    const response = await fetch(`${baseURL}/${name}`);

    const data = await response.json() as NpmPackage;

    if (response.status !== 200) {
        return Result.fail(uiMessage({
            "en-US": "Package not found",
            "pt-BR": "Pacote não encontrado",
        }));
    }

    const versionKey = version === "latest"
        ? data["dist-tags"].latest
        : normalizeVersion(version);

    const hasVersion = !!data.versions[versionKey];

    if (!hasVersion) {
        return Result.fail(uiMessage({
            "en-US": "Package version not found",
            "pt-BR": "Versão do pacote não encontrada",
        }));
    }

    return Result.ok({ ...data, selectedVersion: versionKey });
}

function normalizeVersion(version?: string): string {
    if (!version) return "0.0.0";

    const parts = version.split(".");
    while (parts.length < 3) {
        parts.push("0");
    }
    return parts.slice(0, 3).join(".");
}

export function toNpmName(name: string){
    return name
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll(".", "")
    .replaceAll("/", "")
    .replace(/[^\w\s-]/gi, "");
}

export function getCdPath(filepath: string){
    const basename = path.basename(filepath);
    return basename.trim().includes(" ") 
        ? `cd "./${basename}"` 
        : `cd ./${basename}`
}