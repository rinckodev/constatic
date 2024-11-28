import Conf from "conf";

export interface ProgramMenuProps {
    cliroot: string;
    cwd: string;
    conf: Conf;
}

export type FetchResult<T = undefined> = 
| {
    success: true,
    data: T
}
| {
    success: false,
    error: string
}

export interface EmojiFileInfo {
    path: string;
    name: string;
    extension: string;
    /** Size in KBs */
    size: number;
    base64: string
}