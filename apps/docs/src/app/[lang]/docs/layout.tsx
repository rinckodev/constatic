import { baseOptions } from "@lib/layout.shared";
import { source } from "@lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";

export default async function Layout({ children, params }: LayoutProps<"/[lang]/docs">) {
  const { lang } = await params;
  return (
    <DocsLayout 
      tree={source.pageTree[lang]} 
      {...baseOptions()}
      sidebar={{
        collapsible: false,
        prefetch: false,
      }} 
    >
      {children}
    </DocsLayout>
  );
}
