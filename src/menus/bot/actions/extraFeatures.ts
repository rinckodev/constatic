import { copy } from "fs-extra";
import path from "node:path";

export async function extraFeaturesSetup(extras: string[], extrasPath: string, distPath: string){
    await copy(
        path.join(extrasPath, "gitignore.txt"), 
        path.join(distPath, ".gitignore")
    );
    if (extras.includes("discloud")){
        await copy(
            path.join(extrasPath, "discloud/discloudignore.txt"), 
            path.join(distPath, ".discloudignore")
        )
        await copy(
            path.join(extrasPath, "discloud/discloudconfig.txt"), 
            path.join(distPath, "discloud.config")
        )
    }
}