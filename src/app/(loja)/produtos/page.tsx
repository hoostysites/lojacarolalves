import type { Metadata } from 'next';
import { Listagem } from '@/components/Listagem';
import { getCategorias, getProdutos } from '@/lib/data';

export const metadata: Metadata = { title: 'Loja' };
export const revalidate = 60;

type SP = { busca?: string; filtro?: string; ordem?: string };

export default async function Produtos({ searchParams }: { searchParams: SP }) {
  const { busca, filtro, ordem } = searchParams;
  const [produtos, categorias] = await Promise.all([
    getProdutos({ busca, ordem, novidade: filtro === 'novidades', promo: filtro === 'promocoes' }),
    getCategorias(),
  ]);
  const titulo = busca ? `“${busca}”` : filtro === 'novidades' ? 'Novidades' : filtro === 'promocoes' ? 'Promoções' : 'Toda a loja';
  const eyebrow = busca ? 'Resultado da busca' : 'Carol Alves';
  const sub = filtro === 'promocoes' ? 'Peças lindas com preço especial, por tempo limitado.' : filtro === 'novidades' ? 'O que acabou de chegar na loja.' : null;
  return <Listagem titulo={titulo} eyebrow={eyebrow} subtitulo={sub} produtos={produtos} categorias={categorias} />;
}
