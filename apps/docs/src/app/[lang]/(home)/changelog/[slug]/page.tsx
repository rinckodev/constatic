import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { changelog, source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: PageProps<"/[lang]/changelog/[slug]">) {
    const { slug } = await params;
    const page = changelog.getPage([slug]);
    if (!page) notFound();

    const MDX = page.data.body;

    return <DocsLayout
        tree={changelog.pageTree}
        sidebar={{
            enabled: false
        }}
    >
        <DocsPage 
        
            toc={page.data.toc} 
            full={page.data.full}
            tableOfContent={{
                header: <div className="my-2"/>
            }}   
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
                    components={getMDXComponents({
                        a: createRelativeLink(source, page),
                    })}
                />
            </DocsBody>
        </DocsPage>
    </DocsLayout>

}

export async function generateStaticParams() {
  return changelog.generateParams();
}

export async function generateMetadata(
  { params }: PageProps<"/[lang]/blog/[slug]">,
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