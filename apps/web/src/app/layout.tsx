import "./global.css";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ORIGIN } from "@/lib/shared";

import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: ORIGIN,
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <GoogleAnalytics gaId={"G-KWQLDVETTW"} />
      <GoogleTagManager gtmId={"GTM-P4PTVL7P"} />
      <body className="grid min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
