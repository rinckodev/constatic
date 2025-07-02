import type { FetchResult, NpmPackage } from "#types";
import { uiMessage } from "../helper.ui.js";

const baseURL = "https://registry.npmjs.org";

type FetchNpmPackageResult = FetchResult<NpmPackage & { selectedVersion: string }>;

export async function fetchNpmPackage(lib: string): Promise<FetchNpmPackageResult> {
    const regex = /^(?<name>@?[^@\/]+(?:\/[^@]+)?)(?:@(?<version>.+))?$/;

    const match = lib.match(regex);
    const name = match?.groups?.name;
    const version = match?.groups?.version ?? "latest";

    const response = await fetch(`${baseURL}/${name}`);

    const data = await response.json() as NpmPackage;

    if (response.status !== 200) {
        return {
            success: false,
            error: uiMessage({
                "en-US": "Package not found",
                "pt-BR": "Pacote não encontrado",
            })
        }
    }

    const versionKey = version === "latest"
            ? data["dist-tags"].latest
            : normalizeVersion(version);

    const hasVersion = !!data.versions[versionKey];

    if (!hasVersion){
        return {
            success: false,
            error: uiMessage({
                "en-US": "Package version not found",
                "pt-BR": "Versão do pacote não encontrada",
            })
        }
    }

    return { success: true, data: { ...data, selectedVersion: versionKey } }
}

function normalizeVersion(version?: string): string {
  if (!version) return "0.0.0";

  const parts = version.split(".");
  while (parts.length < 3) {
    parts.push("0");
  }
  return parts.slice(0, 3).join(".");
}
