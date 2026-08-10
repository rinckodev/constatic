import { changelog, getPageImageUrl, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import Og, { getImageResponseOptions } from './generated';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/[lang]/og/[type]/[...slug]'>) {
  const { slug, lang, type } = await params;

  const pages = type == "changelog"
    ? changelog
    : source;

  const page = pages.getPage(slug.slice(0, -1), lang);
  if (!page) notFound();

  return new ImageResponse(
    <Og 
      title={page.data.title} 
      description={page.data.description}
      slugs={page.slugs}
      icon={page.data.icon}
    />,
    await getImageResponseOptions()
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }));
}
