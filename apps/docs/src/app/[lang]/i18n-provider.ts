import { i18n } from "@/lib/i18n";
import { defineI18nUI } from "fumadocs-ui/i18n";

export const { provider: i18nProvider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: "English",
    },
    pt: {
      lastUpdate: "Última atualização",
      searchNoResult: "Sem resultado",
      tocNoHeadings: "Sem cabeçalhos",
      chooseLanguage: "Escolha o idioma",
      displayName: "Português",
      toc: "Nesta página",
      search: "Procurar",
      previousPage: "Anterior",
      nextPage: "Próxima",
      editOnGithub: "Editar no github",
    }
  }
})