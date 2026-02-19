import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { changelog } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: PageProps<"/[lang]/changelog/[slug]">) {
    const { slug, lang } = await params;
    const page = changelog.getPage([slug], lang);
    if (!page) notFound();

    const { body: MDX, toc } = page.data;

    return <DocsPage
        toc={toc}
        full={page.data.full}
        tableOfContent={{
            header: <div className="my-2" />
        }}
        breadcrumb={{ enabled: false }}
    >
        <div className="border-b">
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription className="mb-1">{page.data.description}</DocsDescription>
            <Link
                href={"/changelog"}
                className={cn(buttonVariants({ size: "sm", color: "secondary" }),
                    "mb-2"
                )}
            >
                Voltar para changelog
            </Link>
        </div>
        <DocsBody>
            <MDX
                components={getMDXComponents()}
            />
        </DocsBody>
    </DocsPage>
}

export async function generateStaticParams() {
    const params = changelog.generateParams();
    return params.map(({ lang, slug: [slug] }) => ({
        lang, slug
    }));
}

export async function generateMetadata(
    { params }: PageProps<"/[lang]/changelog/[slug]">,
): Promise<Metadata> {
    const { slug, lang } = await params;

    const page = changelog.getPage([slug]);
    if (!page) notFound();

    const images = {
        alt: "Banner",
        url: `/${lang}/og/changelog/${slug}/image.png`,
    };

    return {
        metadataBase: process.env.NODE_ENV === "development"
            ? new URL("http://localhost:3000")
            : new URL("https://constatic-docs.vercel.app"),
        title: page.data.title,
        description: page.data.description,
        openGraph: {
            images,
        },
        twitter: {
            card: "summary_large_image",
            images,
        },
    } satisfies Metadata;
}