import { Result, ResultType } from "#lib/result.js";
import { execSync, spawn } from "node:child_process";

export class CLIShell {
    public get agent() {
        const userAgent = (
            process.env.npm_config_user_agent ?? ""
        ).toLowerCase();

        for (const agent of ["npm", "bun", "yarn", "pnpm"] as const) {
            if (userAgent.startsWith(agent)) return agent;
        }
        return "npm" as const;
    }
    public get isBun() {
        return this.agent === "bun";
    }
    public run(cwd: string, ...args: string[]) {
        return new Promise<ResultType<number, "code">>(resolve => {
            const child = spawn(this.agent, args, {
                shell: true,
                cwd, env: {
                    ...process.env,
                    NODE_ENV: "development",
                    DISABLE_OPENCOLLECTIVE: "1",
                }
            });
            child.on("exit", code => {
                return resolve(code === 0
                    ? Result.ok(code, "code")
                    : Result.fail("fail", code ?? undefined)
                );
            })
            child.on("error", error => {
                return resolve(Result.fail(error.message, 1));
            })
        });
    }
    public isRepoDirty(cwd?: string) {
        try {
            let stdout = execSync("git status --porcelain", { 
                encoding: "utf-8", cwd, stdio: "pipe" 
            });
            return stdout.trim() !== ""
        } catch (error) {
            if (error?.toString?.().includes("not a git repository")) {
                return false
            }
            return true
        }
    }
}