"use client";
import { ReactElement } from "react";
import { ggsans } from "./font";
import { cn } from "@/lib/cn";

const styles = {
    primary: "bg-dc-primary not-disabled:hover:bg-dc-primary/80 disabled:bg-dc-primary/50",
    secondary: "bg-dc-secondary not-disabled:hover:bg-dc-secondary/80 disabled:bg-dc-secondary/50",
    success: "bg-dc-success not-disabled:hover:bg-dc-success/80 disabled:bg-dc-success/50",
    danger: "bg-dc-danger not-disabled:hover:bg-dc-danger/80 disabled:bg-dc-danger/50",
    link: "bg-dc-secondary not-disabled:hover:bg-dc-secondary/80 disabled:bg-dc-secondary/50",
};

interface DiscordButtonProps {
    style?: keyof typeof styles,
    label?: string;
    disabled?: boolean;
    icon?: ReactElement
}

export function DiscordButton(props: DiscordButtonProps){
    const { label="action", style="primary", disabled=false, icon } = props;
    return <button 
        className={cn(
            styles[style], ggsans.className,
            "flex flex-row gap-2 items-center",
            "px-4 py-1 rounded-md font-semibold text-white disabled:text-white/50",
            "hover:cursor-pointer border border-white/15 disabled:cursor-not-allowed",
        )}
        disabled={disabled}
    >
        {icon} {label}
    </button>
}