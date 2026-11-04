"use client";
import { ConstaticFlare } from "@/components/constatic/flare";
import { GridPattern } from "@/components/constatic/grid";
import { cn } from "@/lib/cn";

import Link from "next/link";
import { useParams } from "next/navigation";

const messages = {
    pt: {
        title: "Página não encontrada",
        description:
            "A página que você está procurando não existe ou foi movida para outro endereço.",
        home: "Voltar para a documentação",
        hint: "Confira o endereço digitado ou volte para o início da documentação.",
    },
    en: {
        title: "Page not found",
        description:
            "The page you're looking for doesn't exist or has been moved to another address.",
        home: "Back to documentation",
        hint: "Check the URL or return to the documentation home.",
    },
} as const;

export default function NotFound() {
    const params = useParams<{ lang?: string }>();
    const lang = params.lang === "pt" ? "pt" : "en";
    const t = messages[lang];

    return (
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
            <ConstaticFlare />
            <p className="mb-3 font-mono text-5xl
                bg-linear-to-r from-white to-fd-muted bg-clip-text
                text-transparent
            ">404</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {t.title}
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-fd-muted-foreground">
                {t.description}
            </p>

            <Link
                href="/docs"
                className="mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-fd-primary px-4 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2 ring-inset ring-1 ring-white/20 "
            >
                {t.home}
            </Link>

            <p className="mt-8 max-w-sm text-sm text-fd-muted-foreground">
                {t.hint}
            </p>
            <GridPattern
                width={60}
                height={60}
                className={cn(
                    "mask-[linear-gradient(-160deg,white,transparent,transparent)] ",
                )}
            />
        </main>
    );
}
