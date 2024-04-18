import Conf from "conf";

declare global {
    interface ProgramProps {
        readonly rootname: string;
        readonly conf: Conf
    }
}