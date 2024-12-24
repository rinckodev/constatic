import { log, shellCommand, uiText } from "#helpers";
import { Language } from "#types";
import { type Ora } from "ora";

interface InstallDepsProps {
    lang: Language, 
    distpath: string, 
    command: string,
    spinner: Ora;
}
export async function installDeps({ lang, command, distpath, spinner }: InstallDepsProps) {
    spinner.text = uiText(lang, {
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
            log.success(uiText(lang, {
               "en-US": "✅ Dependencies installed successfully!",
               "pt-BR": "✅ Dependências instaladas com sucesso!",
            }));
            break;
        }
        case "fail":
        case "error": {
            log[result.status](uiText(lang, {
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