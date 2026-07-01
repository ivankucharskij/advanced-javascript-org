import type { MetadataRoute } from "next";

import { ORIGIN } from "@/lib/shared";
import { source } from "@/lib/source";

const monthly = "monthly" as const;
const weekly = "weekly" as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = ORIGIN;
  const lastModified = new Date();

  return [
    {
      url: siteUrl.toString(),
      lastModified,
      changeFrequency: weekly,
      priority: 1,
    },
    ...source.getPages().map((page) => ({
      url: new URL(page.url, siteUrl).toString(),
      lastModified,
      changeFrequency: monthly,
      priority: 0.7,
    })),
  ];
}
