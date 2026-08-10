import { VariableIcon } from "@public/icons/code/variable";

interface VariableProps {
    identifier: string;
}
export default function Variable(props: VariableProps){
    return <span className="font-mono whitespace-nowrap font-normal">
        <VariableIcon className="inline -translate-y-0.5 w-4 h-4 text-[#75BEFF] mr-0.5"/>
        <span className=" text-[#75BEFF]">
            {props.identifier}
        </span>
    </span>
}