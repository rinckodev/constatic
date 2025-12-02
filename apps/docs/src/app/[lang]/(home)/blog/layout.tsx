import { GridPattern } from "@/components/constatic/grid";
import { baseOptions } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { cn } from "fumadocs-ui/utils/cn";

export default function Layout({
  children,
}: LayoutProps<"/[lang]">): React.ReactElement {
  return <HomeLayout {...baseOptions()}>
    {children}
    <GridPattern
      width={60}
      height={60}
      className={cn(
        "mask-[linear-gradient(-160deg,white,transparent,transparent)] ",
        "opacity-40"
      )}
    />
  </HomeLayout>;
}
