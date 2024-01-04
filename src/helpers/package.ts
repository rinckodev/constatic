import packageJson from "../../package.json";
type PackageJson = typeof packageJson;

const Package = {
    json: packageJson,
    managers: {
        npm: { name: "npm", command: "npm install" },
        yarn: { name: "yarn", command: "yarn add" },
        pnpm: { name: "pnpm", command: "pnpm install" },
        bun: { name: "bun", command: "bun install" },
    }
}

export { Package, PackageJson }