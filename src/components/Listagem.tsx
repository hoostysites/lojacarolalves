import Link from 'next/link';
import { Suspense } from 'react';
import { ProdutoCard } from './ProdutoCard';
import { Ordenacao } from './Ordenacao';
import type { Categoria, Produto } from '@/lib/types';

export function Listagem({ titulo, subtitulo, eyebrow, produtos, categorias, ativa }: {
  titulo: string; subtitulo?: string | null; eyebrow?: string; produtos: Produto[];
  categorias: Categoria[]; ativa?: string;
}) {
  return (
    <>
      <section className="grao relative overflow-hidden bg-vinho-900 py-16 text-center text-creme-100 md:py-20">
        <div className="container-luxo relative">
          <nav className="mb-5 text-[11px] uppercase tracking-[0.2em] text-creme-100/50">
            <Link href="/" className="hover:text-ouro-300">Início</Link> <span className="mx-2 text-ouro-500">/</span> <span className="text-ouro-300">{titulo}</span>
          </nav>
          {eyebrow && <p className="eyebrow text-ouro-400">{eyebrow}</p>}
          <h1 className="mt-2 font-display text-4xl md:text-6xl">{titulo}</h1>
          {subtitulo && <p className="mx-auto mt-4 max-w-xl font-serif text-xl italic text-creme-100/75">{subtitulo}</p>}
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b border-creme-300 bg-creme-100/95 backdrop-blur">
        <div className="container-luxo flex items-center justify-between gap-4 py-3">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            <Chip href="/produtos" ativo={!ativa}>Tudo</Chip>
            {categorias.map((c) => <Chip key={c.id} href={`/categoria/${c.slug}`} ativo={ativa === c.slug}>{c.nome}</Chip>)}
          </div>
          <div className="hidden shrink-0 md:block"><Suspense><Ordenacao /></Suspense></div>
        </div>
      </div>

      <section className="container-luxo py-12 md:py-16">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-tinta/50">{produtos.length} {produtos.length === 1 ? 'peça' : 'peças'}</p>
          <div className="md:hidden"><Suspense><Ordenacao /></Suspense></div>
        </div>
        {produtos.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {produtos.map((p, i) => <ProdutoCard key={p.id} p={p} prioridade={i < 4} />)}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-serif text-3xl italic text-vinho-700">Nenhuma peça encontrada</p>
            <p className="mt-3 text-sm text-tinta/60">Tente outra busca ou fale com a gente no WhatsApp.</p>
            <Link href="/produtos" className="btn-linha mt-8">Ver todas as peças</Link>
          </div>
        )}
      </section>
    </>
  );
}

function Chip({ href, ativo, children }: { href: string; ativo?: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`shrink-0 border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${ativo ? 'border-vinho-700 bg-vinho-700 text-creme-100' : 'border-creme-300 text-tinta/70 hover:border-vinho-700 hover:text-vinho-700'}`}>
      {children}
    </Link>
  );
}
