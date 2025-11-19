import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { i18n } from "./i18n";
import { FaBook, FaNewspaper } from "react-icons/fa";

export function baseOptions(): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: "My App",
    },
    themeSwitch: {
      enabled: false,
    },
    githubUrl: "https://github.com/rinckodev/constatic",
    links: [
      {
        text: <span className="flex gap-2 items-center"><FaBook />Docs</span>,
        url: "/docs",
        active: "nested-url",
      },
      {
        text: <span className="flex gap-2 items-center"><FaNewspaper />Blog</span>,
        url: "/blog",
        active: "nested-url",
      },
    ],
  };
}
