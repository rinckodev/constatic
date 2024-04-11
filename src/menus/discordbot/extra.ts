import path from "path";
import { copyDir } from "../../helpers";
import { DiscordBotTemplatePaths } from "./main";

export async function discordBotExtraFeatures(destinationPath: string, paths: DiscordBotTemplatePaths, extras: string[]){
    await copyDir(
        path.join(paths.extras, "gitignore.txt"), 
        path.join(destinationPath, ".gitignore")
    );
    
    if (extras.includes("discloud")){
        await copyDir(
            path.join(paths.extras, "discloud/discloudignore.txt"), 
            path.join(destinationPath, ".discloudignore")
        )
        await copyDir(
            path.join(paths.extras, "discloud/discloudconfig.txt"), 
            path.join(destinationPath, "discloud.config")
        )
    }
}