"use client";

import { useParams } from "next/navigation";

interface BlogPostDateProps {
    date: Date,
}

export default function BlogPostDate({ date }: BlogPostDateProps) {
    const { lang } = useParams()
    return <>
        <p className="text-fd-muted-foreground text-sm">
            {date.toLocaleDateString(lang, {
                day: "numeric",
                month: "short",
                year: "numeric"
            })}
        </p>
    </>;
}