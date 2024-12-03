import { StdioOptions } from "child_process";
import spawn from "cross-spawn";

interface ShellCommandOptions {
    command: string, args?: string[]
    stdio?: StdioOptions, cwd: string,
}
type ShellCommandResult = 
| {
    status: "success", code: number
} | {
    status: "fail", code?: number
} | {
    status: "error", error: Error, code: number;
}
export function shellCommand(options: ShellCommandOptions): Promise<ShellCommandResult> {
    const { command, args, stdio, cwd } = options;
    return new Promise(resolve => {
        const child = spawn(command, args, { stdio, cwd });

        child.on("exit", code => {
            if (code === 0){
                resolve({ status: "success", code });
                return;
            }
            resolve({ status: "fail", code: code ?? undefined });
        })
        child.on("error", error => {
            resolve({ status: "error", error, code: 1 });
        })
    })
}