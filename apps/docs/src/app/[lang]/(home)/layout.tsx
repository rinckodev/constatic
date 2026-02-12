import { baseOptions } from "@lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";

export default function Layout({ children }: LayoutProps<"/[lang]">) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
