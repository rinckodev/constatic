import { StringIcon } from "@public/icons/code/string";

interface StringProps {
    content: string;
    magic?: boolean;
}
export default function String(props: StringProps){
    return <span className="font-mono whitespace-nowrap font-normal">
        {props.magic &&
            <StringIcon className="inline -translate-y-0.5 w-4 h-4 text-[#CCCCCC] mr-0.5"/>
        }
        <span className=" text-[#CE9178]">
            {props.content}
        </span>
    </span>
}