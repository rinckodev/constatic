import { ConfigIcon, EnvIcon, GitIcon, NodeJSIcon, ReadmeIcon, TsConfigIcon, TsIcon, VSCodeIcon } from "@public/icons/files";
import { File, Files, Folder } from "../../../components/files";

export function BaseStructure() {
    return <Files>
        <Folder name=".vscode">
            <File name="extensions.json" icon={<VSCodeIcon />}/>
            <File name="project.code-snippets" icon={<VSCodeIcon />}/>
            <File name="settings.json" icon={<ConfigIcon />}/>
        </Folder>
        <Folder name="src">
            <Folder name="discord">
                <Folder name="base">
                    <Folder name="commands">
                        <File name="handlers.ts" icon={<TsIcon />} />
                        <File name="manager.ts" icon={<TsIcon />} />
                        <File name="types.ts" icon={<TsIcon />} />
                    </Folder>
                    <Folder name="events">
                        <File name="handlers.ts" icon={<TsIcon />} />
                        <File name="manager.ts" icon={<TsIcon />} />
                        <File name="types.ts" icon={<TsIcon />} />
                    </Folder>
                    <Folder name="responders">
                        <File name="handlers.ts" icon={<TsIcon />} />
                        <File name="manager.ts" icon={<TsIcon />} />
                        <File name="types.ts" icon={<TsIcon />} />
                    </Folder>
                    <File name="app.ts" icon={<TsIcon />} />
                    <File name="base.env.ts" icon={<TsIcon />} />
                    <File name="base.error.ts" icon={<TsIcon />} />
                    <File name="base.logger.ts" icon={<TsIcon />} />
                    <File name="base.version.ts" icon={<TsIcon />} />
                    <File name="bootstrap.ts" icon={<TsIcon />} />
                    <File name="constants.ts" icon={<TsIcon />} />
                    <File name="creators.ts" icon={<TsIcon />} />
                    <File name="index.ts" icon={<TsIcon />} />
                </Folder>
                <Folder name="commands">
                    <Folder name="public">
                        <File name="counter.ts" icon={<TsIcon />} />
                        <File name="ping.ts" icon={<TsIcon />} />
                    </Folder>
                </Folder>
                <Folder name="events">
                    <Folder name="commom">
                        <File name="error.ts" icon={<TsIcon />} />
                    </Folder>
                </Folder>
                <Folder name="responders">
                    <Folder name="buttons">
                        <File name="remind.ts" icon={<TsIcon />} />
                    </Folder>
                </Folder>
                <File name="index.ts" icon={<TsIcon />} />
            </Folder>
            <Folder name="functions">
                <File name="index.ts" icon={<TsIcon />} />
            </Folder>
            <File name="env.ts" icon={<TsIcon />} />
            <File name="index.ts" icon={<TsIcon />} />
        </Folder>
        <File name=".env" icon={<EnvIcon />} />
        <File name=".gitignore" icon={<GitIcon />} />
        <File name="constants.json" icon={<ConfigIcon />} />
        <File name="README.md" icon={<ReadmeIcon />} />
        <File name="package.json" icon={<NodeJSIcon />}/>
        <File name="tsconfig.json" icon={<TsConfigIcon />} />
    </Files>
}