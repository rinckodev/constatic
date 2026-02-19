import { baseOptions } from "@/lib/layout.shared";
import { changelog } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export default async function Layout({ children, params }: LayoutProps<"/[lang]/changelog">) {
    const { lang } = await params;
    return (
        <DocsLayout
            nav={{
                enabled: false,
            }}
            tree={changelog.pageTree[lang]}
            {...baseOptions()}
            sidebar={{
                enabled: false,
            }}
        >
            {children}
        </DocsLayout>
    );
}