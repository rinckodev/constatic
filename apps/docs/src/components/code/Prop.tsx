import { PropIcon } from "@public/icons/code/prop";

interface PropProps {
    identifier: string;
}
export default function Prop(props: PropProps){
    return <span className="font-mono whitespace-nowrap font-normal">
        <PropIcon className="inline -translate-y-0.5 w-4 h-4 text-[#75BEFF] mr-0.5"/>
        <span className=" text-[#75BEFF]">
            {props.identifier}
        </span>
    </span>
}