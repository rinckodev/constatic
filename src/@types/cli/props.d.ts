import { ConfSchema, Language } from "#types";
import Conf from "conf";

export interface ProgramMenuProps {
    lang: Language,
    cliroot: string;
    configdir: string;
    cwd: string;
    conf: Conf<ConfSchema>;
    version: string;
    isBun: boolean;
}