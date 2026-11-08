import type { Metadata, Viewport } from 'next';
import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/500.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/jost/300.css';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import './globals.css';
import { SacolaProvider } from '@/components/SacolaProvider';

const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://lojacarolalves.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: 'Carol Alves | Moda & Acessórios', template: '%s | Carol Alves' },
  description: 'Moda feminina, bolsas e acessórios com curadoria e atendimento personalizado. Feira de Santana - BA.',
  icons: { icon: '/favicon.png', apple: '/apple-icon.png' },
  openGraph: {
    type: 'website', locale: 'pt_BR', siteName: 'Carol Alves',
    title: 'Carol Alves | Moda & Acessórios',
    description: 'Moda feminina, bolsas e acessórios com curadoria e atendimento personalizado.',
    images: ['/og.jpg'],
  },
};

export const viewport: Viewport = { themeColor: '#2E1419' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SacolaProvider>{children}</SacolaProvider>
      </body>
    </html>
  );
}
