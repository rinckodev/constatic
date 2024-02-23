import { readPackageJSON } from "pkg-types";

const Package = {
    json: readPackageJSON,
    managers: {
        npm: { name: "npm", args: ["install"] },
        yarn: { name: "yarn", args: ["add"] },
        pnpm: { name: "pnpm", args: ["install"] },
        bun: { name: "bun", args: ["install"] },
    }
}

export { Package }