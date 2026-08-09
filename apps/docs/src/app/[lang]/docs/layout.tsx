import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';

export default async function Layout({ params, children }: LayoutProps<'/[lang]/docs'>) {
  const lang = (await params).lang;
  return (
    <DocsLayout 
      {...baseOptions(lang)}
      sidebar={{
        collapsible: false
      }}
      tree={source.getPageTree(lang)} 
    >
      {children}
    </DocsLayout>
  );
}
