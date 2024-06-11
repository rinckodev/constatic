import { readPackageJSON } from "pkg-types";

const managers = [
    "npm",
    "yarn",
    "pnpm",
    "bun",
]
    // npm: { name: "npm", args: ["install"] },
    // yarn: { name: "yarn", args: ["install"] },
    // pnpm: { name: "pnpm", args: ["install"] },
    // bun: { name: "bun", args: ["install"] },


const Package = {
    json: readPackageJSON,
    managers,
}

export { Package }