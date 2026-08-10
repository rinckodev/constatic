import { EnumIcon } from "@public/icons/code/enum";

interface EnumProps {
    identifier: string;
    member?: string;
}
export default function Enum(props: EnumProps){
    return <span className="font-mono whitespace-nowrap font-normal">
        <EnumIcon className="inline -translate-y-0.5 w-4 h-4 text-[#EE9D28] mr-0.5"/>
        <span className=" text-[#4EC9B0]">
            {props.identifier}
        </span>
        {props.member && <>
            <span className="text-[#7F8592]">.</span>
            <span className="text-[#4FC1FF]">{props.member}</span>
        </>}
    </span>
}