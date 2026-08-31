export const programRuntime = Object.freeze({
    isBun(){
        return globalThis.Bun !== undefined;
    },
    agent() {
        const userAgent = (
            process.env.npm_config_user_agent ?? ""
        ).toLowerCase();

        for (const agent of ["npm", "bun", "yarn", "pnpm"] as const) {
            if (userAgent.startsWith(agent)) return agent;
        }
        return "npm" as const;
    }
});