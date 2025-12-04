import { CLI } from "#cli";
import { copy } from "#helpers";
import path, { join } from "node:path";

interface Props {
    dist: string,
    cli: CLI,
}

export async function addBotDiscloudAction(props: Props) {
    const { cli, dist } = props;

    const dir = join(
        cli.templates.botPath, "extras", 
        cli.shell.isBun 
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
    if (cli.shell.isBun) {
        await copy(
            path.join(dir, "Dockerfile"),
            join(dist, "Dockerfile")
        );
    }
}