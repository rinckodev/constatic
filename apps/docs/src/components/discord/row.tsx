import { ReactNode } from "react";

interface DiscordActionRowProps {
    children: ReactNode[]
}
export function DiscordActionRow({ children }: DiscordActionRowProps){
    return <div className="flex flex-row gap-2">
        {children}
    </div>
}