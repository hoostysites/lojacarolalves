import Link from 'next/link';
import { ImagemProduto } from './ImagemProduto';
import { brl, descontoPct, precoFinal } from '@/lib/format';
import type { Produto } from '@/lib/types';

export function ProdutoCard({ p, prioridade = false }: { p: Produto; prioridade?: boolean }) {
  const desc = descontoPct(p);
  const esgotado = p.status === 'esgotado';
  return (
    <Link href={`/produto/${p.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-creme-200">
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]">
          <ImagemProduto src={p.imagens?.[0]} alt={p.nome} prioridade={prioridade} />
        </div>
        {p.imagens?.[1] && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
            <ImagemProduto src={p.imagens[1]} alt={p.nome} />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {desc > 0 && !esgotado && <span className="bg-vinho-700 px-2.5 py-1 text-[10px] font-medium tracking-[0.15em] text-creme-100">-{desc}%</span>}
          {p.novidade && !esgotado && <span className="bg-creme-100/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-vinho-800">Novo</span>}
          {p.status === 'ultimas' && <span className="bg-ouro-500 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-vinho-900">Últimas peças</span>}
        </div>
        {esgotado && (
          <div className="absolute inset-0 flex items-center justify-center bg-creme-100/55 backdrop-blur-[1px]">
            <span className="border border-vinho-700 bg-creme-100 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-vinho-700">Esgotado</span>
          </div>
        )}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="block bg-vinho-900/90 py-2.5 text-center text-[10.5px] uppercase tracking-[0.22em] text-ouro-300 backdrop-blur">Ver detalhes</span>
        </div>
      </div>
      <div className="pt-4 text-center">
        {p.categoria?.nome && <p className="eyebrow mb-1.5 text-[10px]">{p.categoria.nome}</p>}
        <h3 className="font-serif text-[1.2rem] leading-snug text-tinta transition-colors group-hover:text-vinho-600">{p.nome}</h3>
        <div className="mt-1.5 flex items-center justify-center gap-2">
          {desc > 0 && <span className="text-sm text-tinta/40 line-through">{brl(p.preco)}</span>}
          <span className="font-medium text-vinho-700">{brl(precoFinal(p))}</span>
        </div>
        {p.cores?.length > 1 && (
          <div className="mt-2 flex justify-center gap-1.5">
            {p.cores.slice(0, 5).map((c) => (
              <span key={c.nome} title={c.nome} className="h-3 w-3 rounded-full ring-1 ring-tinta/15" style={{ background: c.hex }} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
