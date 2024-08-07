import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
    clean: true,
	rollup: {
		inlineDependencies: false,
        output: {
            format: "esm",
            preserveModules: true,
            preserveModulesRoot: "./src"
        },
	},
	entries: ["src/index"],
});