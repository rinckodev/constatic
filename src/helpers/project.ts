export function toNpmName(name: string){
    return name
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll(".", "")
    .replaceAll("/", "")
    .replace(/[^\w\s-]/gi, "");
}