import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageCircle, Store, ShieldCheck } from 'lucide-react';
import { Galeria } from '@/components/Galeria';
import { CompraProduto } from '@/components/CompraProduto';
import { ProdutoCard } from '@/components/ProdutoCard';
import { getConfig, getProduto, getProdutos } from '@/lib/data';
import { brl, descontoPct, precoFinal } from '@/lib/format';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProduto(params.slug);
  if (!p) return { title: 'Produto' };
  return {
    title: p.nome,
    description: p.descricao?.slice(0, 155) || undefined,
    openGraph: { title: p.nome, images: p.imagens?.[0] ? [p.imagens[0]] : ['/og.jpg'] },
  };
}

export default async function ProdutoPage({ params }: { params: { slug: string } }) {
  const p = await getProduto(params.slug);
  if (!p) notFound();
  const [config, relacionados] = await Promise.all([
    getConfig(), getProdutos({ categoriaId: p.categoria_id || undefined, excetoId: p.id, limite: 4 }),
  ]);
  const desc = descontoPct(p);
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.nome, description: p.descricao, image: p.imagens,
    brand: { '@type': 'Brand', name: 'Carol Alves' },
    offers: { '@type': 'Offer', priceCurrency: 'BRL', price: precoFinal(p), availability: p.status === 'esgotado' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-luxo py-6">
        <nav className="text-[11px] uppercase tracking-[0.18em] text-tinta/50">
          <Link href="/" className="hover:text-vinho-700">Início</Link>
          {p.categoria && <><span className="mx-2 text-ouro-500">/</span><Link href={`/categoria/${p.categoria.slug}`} className="hover:text-vinho-700">{p.categoria.nome}</Link></>}
          <span className="mx-2 text-ouro-500">/</span><span className="text-vinho-700">{p.nome}</span>
        </nav>
      </div>
      <section className="container-luxo grid gap-10 pb-20 md:grid-cols-[1.15fr_1fr] lg:gap-16">
        <Galeria imagens={p.imagens} nome={p.nome} />
        <div className="md:sticky md:top-24 md:self-start">
          {p.categoria && <p className="eyebrow">{p.categoria.nome}</p>}
          <h1 className="mt-3 font-display text-3xl leading-tight text-vinho-800 md:text-[2.6rem]">{p.nome}</h1>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl text-vinho-700">{brl(precoFinal(p))}</span>
            {desc > 0 && <><span className="text-lg text-tinta/40 line-through">{brl(p.preco)}</span><span className="bg-vinho-700 px-2 py-0.5 text-xs text-creme-100">-{desc}%</span></>}
          </div>
          {p.status === 'ultimas' && <p className="mt-3 text-sm font-medium text-ouro-700">✦ Últimas peças disponíveis</p>}
          {p.status === 'esgotado' && <p className="mt-3 text-sm font-medium text-vinho-600">Esgotado no momento</p>}
          <div className="my-7 h-px bg-gradient-to-r from-ouro-500/60 via-creme-300 to-transparent" />
          <CompraProduto p={p} config={config} />
          <div className="mt-8 grid grid-cols-3 gap-3 border-y border-creme-300 py-5 text-center">
            {[[MessageCircle, 'Atendimento no WhatsApp'], [Store, 'Retire na loja'], [ShieldCheck, 'Compra segura']].map(([I, t]) => {
              const Icon = I as typeof Store;
              return <div key={t as string} className="flex flex-col items-center gap-2"><Icon className="h-5 w-5 text-ouro-600" strokeWidth={1.3} /><span className="text-[10px] uppercase leading-tight tracking-[0.14em] text-tinta/60">{t as string}</span></div>;
            })}
          </div>
          {p.descricao && (
            <details open className="group border-b border-creme-300 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-vinho-800">Descrição <span className="text-lg transition group-open:rotate-45">+</span></summary>
              <p className="mt-4 whitespace-pre-line font-serif text-lg leading-relaxed text-tinta/75">{p.descricao}</p>
            </details>
          )}
          <details className="group border-b border-creme-300 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-vinho-800">Como comprar <span className="text-lg transition group-open:rotate-45">+</span></summary>
            <p className="mt-4 text-sm leading-relaxed text-tinta/70">Adicione as peças à sacola e finalize pelo WhatsApp. A gente confirma disponibilidade, forma de pagamento e combina entrega ou retirada na loja.</p>
          </details>
        </div>
      </section>
      {relacionados.length > 0 && (
        <section className="border-t border-creme-300 bg-creme-200/50 py-20">
          <div className="container-luxo">
            <div className="mb-10 text-center"><p className="eyebrow">Combine com</p><h2 className="titulo-secao mt-3">Você também vai amar</h2></div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {relacionados.map((r) => <ProdutoCard key={r.id} p={r} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
