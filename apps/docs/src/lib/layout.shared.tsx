import { ConstaticTitle } from "@/components/constatic/title";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { FaBook } from "react-icons/fa";
import { MdOutlineUpdate } from "react-icons/md";
import { i18n } from "./i18n";

export function baseOptions(): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: <ConstaticTitle />,
    },
    themeSwitch: {
      enabled: false,
    },
    githubUrl: "https://github.com/rinckodev/constatic",
    links: [
      {
        text: <span className="flex gap-2 items-center"><FaBook/>Docs</span>,
        url: "/docs",
        active: "nested-url",
      },
      {
        text: <span className="flex gap-2 items-center"><MdOutlineUpdate size={20} />Changelog</span>,
        url: "/changelog",
        active: "nested-url",
      },
    ],
  };
}
