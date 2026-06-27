import { notFound } from "next/navigation";

import { getLLMText, source } from "@/lib/source";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/llms.mdx/[...slug]">,
) {
  const { slug } = await params;

  if (slug.at(-1) !== "content.md") {
    notFound();
  }

  const page = source.getPage(slug.slice(0, -1));
  if (!page) {
    notFound();
  }

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  return source.generateParams().map((params) => ({
    slug: [...params.slug, "content.md"],
  }));
}
