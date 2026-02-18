"use client";

import { cn } from "@/lib/cn";
import { JetBrains_Mono } from "next/font/google";
import { JSX, useState } from "react";
import { FaNodeJs } from "react-icons/fa";
import { FiCheck, FiCopy } from "react-icons/fi";
import { SiBun, SiPnpm } from "react-icons/si";
import { TbBrandYarn } from "react-icons/tb";

const font = JetBrains_Mono({
    subsets: ["latin"]
});

type Props = {
    packageName: string;
};

type Tab = {
    id: string;
    label: string;
    icon: JSX.Element;
    command: (name: string) => string;
};

const tabs: Tab[] = [
    {
        id: "node",
        label: "node.js",
        icon: <FaNodeJs size={18} />,
        command: name => `npx ${name}`
    },
    {
        id: "bun",
        label: "bun",
        icon: <SiBun size={18} />,
        command: name => `bunx ${name}`
    },
    {
        id: "yarn",
        label: "yarn",
        icon: <TbBrandYarn size={18} />,
        command: name => `yarn dlx ${name}`
    },
    {
        id: "pnpm",
        label: "pnpm",
        icon: <SiPnpm size={18} />,
        command: name => `pnpm dlx ${name}`
    }
];

export function CliCommand({ packageName: name }: Props) {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [copied, setCopied] = useState(false);

    const active = tabs.find(t => t.id === activeTab)!;
    const command = active.command(name);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    return (
        <div className={`${font.className} w-full border rounded-lg shadow overflow-clip my-2`}>
            <div className="flex border-b bg-fd-background px-2 overflow-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                            "hover:cursor-pointer",
                            activeTab === tab.id
                                ? "border-b-2 border-fd-primary text-fd-primary"
                                : "text-fd-muted-foreground hover:text-fd-foreground"
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="p-2 flex items-center justify-between gap-2 bg-fd-card">
                <code className={cn(
                    "not-prose px-3 py-2 rounded block font-mono text-sm",
                    font.className,
                )}>
                    {command}
                </code>
                <button
                    onClick={handleCopy}
                    className="p-2 rounded hover:bg-fd-accent transition-colors
                    hover:cursor-pointer"
                >
                    {copied ? (
                        <FiCheck className="text-green-600" />
                    ) : (
                        <FiCopy className="text-fd-muted-foreground" />
                    )}
                </button>
            </div>
        </div>
    );
}
