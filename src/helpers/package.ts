import { readPackageJSON } from "pkg-types";

const managers = {
    npm: { name: "npm", args: ["install"] },
    yarn: { name: "yarn", args: ["add"] },
    pnpm: { name: "pnpm", args: ["install"] },
    bun: { name: "bun", args: ["install"] },
}

const managerList = Object.keys(managers);

const Package = {
    json: readPackageJSON,
    managers, managerList
}

export { Package }