import { shellCommand } from "./shell.js";

export function npmInstall(destination: string, manager: string){
    return shellCommand({
        command: manager, args: ["install"],
        stdio: "ignore", cwd: destination
    });
}