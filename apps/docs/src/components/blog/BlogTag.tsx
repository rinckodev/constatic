import { cn } from "fumadocs-ui/utils/cn";

export const blogTags = {
    cli: {
        title: "CLI",
        style: `dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800
        bg-neutral-400 text-neutral-900 hover:bg-neutral-300
        `,
        border: "dark:border-neutral-400 border-neutral-900",
    },
    botbase: {
        title: "Bot Base",
        style: `dark:bg-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-800
        bg-indigo-400 text-indigo-900 hover:bg-indigo-300
        `,
        border: "dark:border-indigo-400 border-indigo-900",
    },
    updates: {
        title: "Atualizações",
        style: `dark:bg-green-900 dark:text-green-500 dark:hover:bg-green-800
        bg-green-500 text-green-900 hover:bg-green-300
        `,
        border: "dark:border-green-500 border-green-900",
    },
    feats: {
        title: "Novidades",
        style: `dark:bg-yellow-900 dark:text-yellow-500 dark:hover:bg-yellow-800
        bg-yellow-500 text-yellow-900 hover:bg-yellow-400
        `,
        border: "dark:border-yellow-500 border-yellow-900",
    },
    tips: {
        title: "Dicas",
        style: `dark:bg-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-600
        bg-yellow-300 text-yellow-700 hover:bg-yellow-200
        `,
        border: "dark:border-yellow-300 border-yellow-800",
    },
    experimental: {
        title: "Experimental",
        style: `black:bg-emerald-900 black:text-emerald-500 black:hover:bg-emerald-800
        bg-emerald-500 text-emerald-900 hover:bg-emerald-400
        `,
        border: "dark:border-emerald-200 border-emerald-900",
    },
    guides: {
        title: "Guias",
        style: `dark:bg-sky-900 dark:text-sky-500 dark:hover:bg-sky-800
        bg-sky-500 text-sky-900 hover:bg-sky-400
        `,
        border: "dark:border-sky-500 border-sky-900",
    },
    problems: {
        title: "Problemas",
        style: `dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800
        bg-red-400 text-red-900 hover:bg-red-300
        `,
        border: "dark:border-red-400 border-red-900",
    },
} as const;

export type BlogTags = keyof typeof blogTags

interface BadgeProps {
    tag: BlogTags | (string & {});
    className?: string;
}
export function BlogTag({ tag, className }: BadgeProps) {
    const { style, title } = tag in blogTags
        ? blogTags[tag as BlogTags]
        : {
            title: tag,
            style: `border dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500 dark:hover:bg-neutral-800
            border-neutral-400 bg-neutral-500 text-neutral-900 hover:bg-neutral-400
            `
        }
    return (
        <div className={cn(
            `rounded-md text-xs px-2 py-0.5 font-mono`,
            style, className
        )}>
            {title}
        </div>
    )
}
