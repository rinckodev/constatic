import packageJson from "../../package.json";
type PackageJson = typeof packageJson;

const Package = {
    json: packageJson,
    managers: {
        npm: { name: "npm", args: ["install"] },
        yarn: { name: "yarn", args: ["add"] },
        pnpm: { name: "pnpm", args: ["install"] },
        bun: { name: "bun", args: ["install"] },
    }
}

export { Package, PackageJson }