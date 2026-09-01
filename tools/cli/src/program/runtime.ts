import { Result, ResultType } from "#utils/result.js";
import { spawn } from "node:child_process";

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
    },
    agentRun(cwd: string, ...args: string[]) {
        return new Promise<ResultType<number>>(resolve => {
            const child = spawn(this.agent(), args, {
                shell: true,
                cwd, env: {
                    ...process.env,
                    NODE_ENV: "development",
                    DISABLE_OPENCOLLECTIVE: "1",
                }
            });
            child.on("exit", code => {
                return resolve(code === 0
                    ? Result.ok(code)
                    : Result.fail("fail", code ?? undefined)
                );
            })
            child.on("error", error => {
                return resolve(Result.fail(error.message, 1));
            })
        });
    }
});