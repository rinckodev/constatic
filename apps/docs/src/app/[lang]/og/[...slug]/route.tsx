import { ImageResponse } from 'next/og';
import Og, { getImageResponseOptions } from './generated';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/[lang]/og/[...slug]'>) {
  const { lang } = await params;

  return new ImageResponse(
    <Og />,
    await getImageResponseOptions()
  );
}

export async function generateStaticParams() {
  return [
    { lang: 'pt' },
    { lang: 'en' },
  ];
}