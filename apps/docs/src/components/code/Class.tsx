import { ClassIcon } from "@public/icons/code/class";

interface ClassProps {
    identifier: string;
}
export default function Class(props: ClassProps){
    return <span className="font-mono whitespace-nowrap font-normal">
        <ClassIcon className="inline -translate-y-0.5 w-4 h-4 text-[#EE9D28] mr-0.5"/>
        <span className=" text-[#4EC9B0]">
            {props.identifier}
        </span>
    </span>
}