import spawn from "cross-spawn";

type NpmInstallResult = | {
    status: "success"
    code?: number
} | {
    status: "fail"
    code?: number
} | {
    status: "error",
    error: Error
    code?: number
}
export function npmInstall(destination: string, manager: { name: string, args: string[] }){
    const { name, args } = manager;
    return new Promise<NpmInstallResult>(resolve => {
        const child = spawn(name, args, { stdio: "ignore", cwd: destination });

        child.on("exit", async (code) => {
            if (code === 0) {
                resolve({ status: "success", code });
                return;
            }
            resolve({ status: "fail", code: code ?? undefined });
        });
        child.on("error", async (error) => {
            resolve({ status: "error", error, code: 1 });
        })
    })
}