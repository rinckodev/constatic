export interface NpmPackage {
    name: string;
    "dist-tags": { latest: string }
    versions: Record<string, object>
    time: Record<(string&{}) | "created" | "modified">
}