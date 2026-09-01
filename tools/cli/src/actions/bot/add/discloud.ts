// import { CLI } from "../../../cli/index.txt";
import { copy } from "#helpers";
import { program } from "#program";
import path, { join } from "node:path";

interface Props {
    dist: string,
}

export async function addBotDiscloudAction(props: Props) {
    const { dist } = props;

    const dir = join(
        program.templates.path, "extras", 
        program.runtime.isBun() 
            ? "bun" 
            : "discloud"
    );
    await copy(
        path.join(dir, "discloud.ignore.txt"),
        join(dist, ".discloudignore")
    );
    await copy(
        path.join(dir, "discloud.config.txt"),
        join(dist, "discloud.config")
    );
    if (program.runtime.isBun()) {
        await copy(
            path.join(dir, "Dockerfile"),
            join(dist, "Dockerfile")
        );
    }
}