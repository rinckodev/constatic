import { shellCommand } from "#helpers";
import { spinner as createSpinner, log } from "@clack/prompts";

export async function installDependencies(distPath: string, command: string) {
    const spinner = createSpinner();
    spinner.start("Installing dependencies");
    
    const result = await shellCommand({ command, args: ["install"], cwd: distPath });

    switch (result.status) {
        case "success": {
            spinner.stop("✅ Dependencies installed successfully!", result.code);
            break;
        }
        case "fail":
        case "error": {
            spinner.stop("❌ Unable to install dependencies!", result.code);
            if (result.status === "error") log.error(result.error.message);
            break;
        }
    }
}