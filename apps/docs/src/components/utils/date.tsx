"use client";
import { useParams } from "next/navigation";

export default function DisplayDate({ date }: {
    date: Date,
}) {
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