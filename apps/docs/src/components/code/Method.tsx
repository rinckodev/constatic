import { MethodIcon } from "@public/icons/code/method";

interface MethodProps {
    identifier: string;
}
export default function Method(props: MethodProps){
    return <span className="font-mono whitespace-nowrap font-normal">
        <MethodIcon className="inline -translate-y-0.5 w-4 h-4 text-[#B180D7] mr-0.5"/>
        <span className=" text-[#DCDCAA]">
            {props.identifier}
        </span>
    </span>
}