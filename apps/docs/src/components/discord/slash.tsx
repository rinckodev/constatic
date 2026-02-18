import { cn } from "@/lib/cn";
import avatar from "@public/avatar/awes.svg";
import Image from "next/image";
import { ggsans } from "./font";

interface CommandOption {
  name: string;
  description?: string;
  type?: "number" | "text"
}

interface DiscordSlashCommandProps {
    name: string;
    description?: string;
    group?: string;
    subcommand?: string;
    options?: CommandOption[]
}
export function DiscordSlashCommand(props: DiscordSlashCommandProps) {
    const { name, description=name, group, subcommand, options=[] } = props;
    return <div className={cn(
        ggsans.className,
        "rounded-md overflow-hidden shadow-md border-[1.6px] border-dc-border"
    )}>
        <div className="
          flex flex-row gap-2 py-0.5 px-4 items-center 
          bg-dc-secondary border-b-[1.6px] border-dc-border
          ">
            <span className="font-bold text">
                {subcommand??name}
            </span>
            <span className="text-[0.80rem] font-semibold text-white/40">
                {description}
            </span>
        </div>
        <div className="bg-dc-secondary-darker flex flex-row gap-2 py-2 px-4">
            <Image src={avatar}
                style={{
                    margin: 0
                }}
                alt="bot-avatar"
                className="w-8 h-8 rounded-full"
            />
            <div className="w-full flex flex-row justify-between items-center">
                <div className="flex flex-row justify-start gap-2 items-center">
                  <span className="font-bold">/{name} {group} {subcommand}</span>
                  {options.map((data, index) => (
                    <div key={index} className="border-2 border-dc-info rounded-sm flex overflow-clip">
                      <div className="
                        bg-dc-darker h-full px-2
                      ">{data.name}</div>
                      <input 
                        type={data.type??"button"}
                        className="w-25 bg-dc-secondary outline-none px-2" 
                      />
                    </div>
                  ))}
                </div>
                <ChatIcon className="w-5 h-5 text-indigo-400 hover:cursor-pointer"/>
            </div>
        </div>
    </div>
}

function ChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 33 33"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1884_722)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.26489 13.137L17.1188 15.3593C17.3402 15.4002 17.5403 15.5173 17.6843 15.6903C17.8283 15.8633 17.9072 16.0814 17.9072 16.3065C17.9072 16.5316 17.8283 16.7496 17.6843 16.9226C17.5403 17.0957 17.3402 17.2128 17.1188 17.2536L5.26489 19.4776L0.564262 28.874C-0.4517 30.9059 1.70502 33.0627 3.73694 32.0467L30.9967 18.42C32.7407 17.5496 32.7407 15.0633 30.9967 14.1914L3.73694 0.566261C1.70502 -0.449701 -0.4517 1.70702 0.564262 3.73894L5.26489 13.137Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_1884_722">
          <rect
            width="32"
            height="32"
            fill="currentColor"
            transform="translate(0.304688 0.306686)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
