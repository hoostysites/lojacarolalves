import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SacolaDrawer } from '@/components/SacolaDrawer';
import { WhatsFlutuante } from '@/components/WhatsFlutuante';
import { getCategorias, getConfig } from '@/lib/data';

export const revalidate = 60;

export default async function LojaLayout({ children }: { children: React.ReactNode }) {
  const [config, categorias] = await Promise.all([getConfig(), getCategorias()]);
  return (
    <>
      <Header categorias={categorias} config={config} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer config={config} categorias={categorias} />
      <SacolaDrawer config={config} />
      <WhatsFlutuante numero={config.whatsapp} nome={config.nome} />
    </>
  );
}
