import { translations } from '@/lib/layout.shared';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from 'next/font/google';
import '../global.css';

const geistMono = Geist_Mono({
  subsets: ["latin"]
});

const geist = Geist({
  subsets: ["latin"]
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
});

const inter = Inter({
  subsets: ['latin'],
});

export default async function Layout({ 
  params,
  children 
}: LayoutProps<'/[lang]'>) {
  const lang = (await params).lang
  return (
    <html 
      lang={lang} 
      className={
        `dark ${inter.className} ${geist.className} ${jetbrainsMono.className} ${geistMono.className}`
      } 
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider
        theme={{ enabled: false, hotKey: false }}
          i18n={i18nProvider(translations, lang)}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
