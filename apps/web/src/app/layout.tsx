import "./global.css";

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
      <body className="grid min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
