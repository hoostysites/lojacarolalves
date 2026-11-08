import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listagem } from '@/components/Listagem';
import { getCategorias, getProdutos } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cat = (await getCategorias()).find((c) => c.slug === params.slug);
  return { title: cat?.nome || 'Categoria', description: cat?.descricao || undefined };
}

export default async function CategoriaPage({ params, searchParams }: { params: { slug: string }; searchParams: { ordem?: string } }) {
  const categorias = await getCategorias();
  const cat = categorias.find((c) => c.slug === params.slug);
  if (!cat) notFound();
  const produtos = await getProdutos({ categoriaId: cat.id, ordem: searchParams.ordem });
  return <Listagem titulo={cat.nome} eyebrow="Categoria" subtitulo={cat.descricao} produtos={produtos} categorias={categorias} ativa={cat.slug} />;
}
