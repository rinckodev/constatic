import type { PackageJson } from "pkg-types";

export function packageJsonHasDeps(packageJson: PackageJson, type?: "dev" | "prod"): boolean {
    const depsMap = {
        prod: packageJson.dependencies,
        dev: packageJson.devDependencies,
    };

    if (type) {
        const deps = depsMap[type];
        return !!deps && Object.keys(deps).length > 0;
    }

    return Object.values(depsMap).some(
        (deps) => !!deps && Object.keys(deps).length > 0
    );
}