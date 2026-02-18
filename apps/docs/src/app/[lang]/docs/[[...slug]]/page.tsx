import { getMDXComponents } from "@/mdx-components";
import { source } from "@lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page(props: PageProps<"/[lang]/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents()}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  { params }: PageProps<"/[lang]/docs/[[...slug]]">,
): Promise<Metadata> {
  const { slug = [], lang } = await params;

  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const images = {
    alt: "Banner",
    url: `/${lang}/og/docs/${slug.join("/")}/image.png`,
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
