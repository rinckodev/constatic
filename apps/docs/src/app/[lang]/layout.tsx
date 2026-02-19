import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter } from "next/font/google";
//@ts-ignore
import "@/app/global.css";
import { i18nProvider } from "./i18n-provider";

const inter = Inter({
  subsets: ["latin"],
});

export default async function Layout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          i18n={i18nProvider(lang)}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
