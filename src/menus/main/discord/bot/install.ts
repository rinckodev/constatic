import { log, shellCommand, uiMessage } from "#helpers";
import type { Ora } from "ora";

interface InstallDepsProps {
    distpath: string, 
    command: string,
    spinner: Ora;
}
export async function installDeps({ command, distpath, spinner }: InstallDepsProps) {
    spinner.text = uiMessage({
        "en-US": "Installing dependencies...",
        "pt-BR": "Instalando dependências...",
    });
    
    const result = await shellCommand({ 
        command, args: ["install"], cwd: distpath,
        stdio: "ignore",
    });
    spinner.stop();

    switch (result.status) {
        case "success": {
            log.success(uiMessage({
               "en-US": "✅ Dependencies installed successfully!",
               "pt-BR": "✅ Dependências instaladas com sucesso!",
            }));
            break;
        }
        case "fail":
        case "error": {
            log[result.status](uiMessage({
               "en-US": [
                "❌ Unable to install dependencies!",
                `Install manually using ${command} install`
               ].join("\n"),
               "pt-BR": [
                "❌ Não foi possível instalar dependências!",
                `Instale manualmente usando ${command} install`
               ].join("\n"),
            }));
            if (result.status === "error") log.error(result.error.message);
            break;
        }
    }
}