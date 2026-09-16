import { UrlObject } from "node:url";

import { Home } from "lucide-react";
import Link from "next/link";

export default function Header({
  title,
  homeLink,
}: {
  title: string;
  homeLink: string | UrlObject;
}) {
  return (
    <header>
      <h1 className="flex items-center justify-between gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
        <Link href={homeLink}>
          <Home />
        </Link>
      </h1>
    </header>
  );
}
