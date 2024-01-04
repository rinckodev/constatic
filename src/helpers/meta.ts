import { dirname } from "node:path";
import { fileURLToPath } from "node:url"

export function importMeta(meta: ImportMeta){
    const __filename = fileURLToPath(meta.url);
    const __dirname = dirname(__filename);
    return { __dirname, __filename }
}