import { InterfaceIcon } from "@public/icons/code/interface";

interface InterfaceProps {
    identifier: string;
}
export default function Interface(props: InterfaceProps){
    return <span className="font-mono whitespace-nowrap font-normal">
        <InterfaceIcon className="inline -translate-y-0.5 w-4 h-4 text-[#75BEFF] mr-0.5"/>
        <span className=" text-[#75BEFF]">
            {props.identifier}
        </span>
    </span>
}