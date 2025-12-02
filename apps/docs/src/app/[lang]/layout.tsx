import { i18n } from "@/lib/i18n";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter } from "next/font/google";
//@ts-ignore
import "../global.css";

const inter = Inter({
  subsets: ["latin"],
});

const { provider } = defineI18nUI(i18n, {
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

export default async function Layout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          i18n={provider(lang)}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
