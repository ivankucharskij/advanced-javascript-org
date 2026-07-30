import { generate as DefaultImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

import { appName } from '@/lib/shared';
import { getPageImage, source } from '@/lib/source';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/[...slug]'>) {
  const { slug } = await params;

  if (slug.length === 1 && slug[0] === 'image.png') {
    return createImage('Advanced JavaScript');
  }

  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return createImage(page.data.title);
}

function createImage(title: string) {
  return new ImageResponse(
    <DefaultImage title={title} site={appName} />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return [
    {
      slug: ['image.png'],
    },
    ...source.getPages().map((page) => ({
      lang: page.locale,
      slug: getPageImage(page).segments,
    })),
  ];
}
