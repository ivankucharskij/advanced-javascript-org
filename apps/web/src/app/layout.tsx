import "./global.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { getEnv } from "@/lib/env-config";

import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

const siteUrl = getEnv().WEB_ORIGIN;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="grid min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
