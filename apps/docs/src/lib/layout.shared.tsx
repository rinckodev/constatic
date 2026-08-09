import ConstaticTitle from '@/components/constatic/ConstaticTitle';
import { uiTranslations } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { FaBook } from 'react-icons/fa';
import { MdOutlineUpdate } from 'react-icons/md';
import { i18n } from './i18n';
import { gitConfig } from './shared';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    en: {
      displayName: "English"
    },
    pt: {
      displayName: "Português"
    }
  })

export function baseOptions(_locale: string): BaseLayoutProps {
  return {
    
    themeSwitch: {
      enabled: false,
    },
    nav: {
      title: <ConstaticTitle />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
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
