import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/">) {
  const tree = source.getPageTree();
  const sidebarItems = [...tree.children];

  // sidebarItems.splice(sidebarItems.length - 3, 0, {
  //   type: "page",
  //   name: "Challenges",
  //   url: "/challenges",
  // });

  return (
    <DocsLayout
      tree={{
        ...tree,
        children: sidebarItems,
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
