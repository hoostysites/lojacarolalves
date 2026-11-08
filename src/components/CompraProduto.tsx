'use client';
import { useState } from 'react';
import { Check, Minus, Plus, Share2 } from 'lucide-react';
import { useSacola } from './SacolaProvider';
import { brl, precoFinal, waLink } from '@/lib/format';
import type { Config, Produto } from '@/lib/types';

export function CompraProduto({ p, config }: { p: Produto; config: Config }) {
  const { adicionar } = useSacola();
  const unico = p.tamanhos?.length === 1 ? p.tamanhos[0] : null;
  const [tam, setTam] = useState<string | null>(unico);
  const [cor, setCor] = useState<string | null>(p.cores?.length === 1 ? p.cores[0].nome : null);
  const [qtd, setQtd] = useState(1);
  const [erro, setErro] = useState('');
  const [copiado, setCopiado] = useState(false);
  const esgotado = p.status === 'esgotado';
  const preco = precoFinal(p);
  const temWhats = !!(config.whatsapp || '').replace(/\D/g, '');

  const validar = () => {
    if (p.tamanhos?.length && !tam) { setErro('Escolha um tamanho'); return false; }
    if (p.cores?.length && !cor) { setErro('Escolha uma cor'); return false; }
    setErro(''); return true;
  };
  const addSacola = () => {
    if (!validar()) return;
    adicionar({ produtoId: p.id, slug: p.slug, nome: p.nome, imagem: p.imagens?.[0] || null, preco, tamanho: tam, cor }, qtd);
  };
  const perguntar = () => {
    const det = [tam && `tamanho ${tam}`, cor && `cor ${cor}`].filter(Boolean).join(', ');
    const url = typeof window !== 'undefined' ? window.location.href : '';
    window.open(waLink(config.whatsapp, `Olá! Tenho interesse na peça *${p.nome}*${det ? ` (${det})` : ''} - ${brl(preco)}.\n${url}`), '_blank');
  };
  const compartilhar = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: p.nome, url });
      else { await navigator.clipboard.writeText(url); setCopiado(true); setTimeout(() => setCopiado(false), 2000); }
    } catch {}
  };

  return (
    <div className="space-y-7">
      {p.tamanhos?.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="label mb-0">Tamanho {tam && <span className="ml-1 normal-case tracking-normal text-vinho-700">· {tam}</span>}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {p.tamanhos.map((t) => (
              <button key={t} onClick={() => { setTam(t); setErro(''); }} disabled={esgotado}
                className={`h-11 min-w-[48px] border px-3 text-sm transition ${tam === t ? 'border-vinho-700 bg-vinho-700 text-creme-100' : 'border-creme-300 bg-white hover:border-vinho-700'}`}>{t}</button>
            ))}
          </div>
        </div>
      )}
      {p.cores?.length > 0 && (
        <div>
          <p className="label mb-3">Cor {cor && <span className="ml-1 normal-case tracking-normal text-vinho-700">· {cor}</span>}</p>
          <div className="flex flex-wrap gap-3">
            {p.cores.map((c) => (
              <button key={c.nome} onClick={() => { setCor(c.nome); setErro(''); }} title={c.nome} aria-label={c.nome} disabled={esgotado}
                className={`relative h-10 w-10 rounded-full ring-offset-2 ring-offset-creme-100 transition ${cor === c.nome ? 'ring-2 ring-vinho-700' : 'ring-1 ring-tinta/15 hover:ring-tinta/40'}`}
                style={{ background: c.hex }}>
                {cor === c.nome && <Check className={`absolute inset-0 m-auto h-4 w-4 ${isClaro(c.hex) ? 'text-tinta' : 'text-white'}`} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {!esgotado && (
        <div className="flex gap-3">
          <div className="flex items-center border border-creme-300 bg-white">
            <button onClick={() => setQtd(Math.max(1, qtd - 1))} className="px-4 py-3.5" aria-label="Diminuir"><Minus className="h-3.5 w-3.5" /></button>
            <span className="w-8 text-center">{qtd}</span>
            <button onClick={() => setQtd(qtd + 1)} className="px-4 py-3.5" aria-label="Aumentar"><Plus className="h-3.5 w-3.5" /></button>
          </div>
          <button onClick={addSacola} className="btn-vinho flex-1">Adicionar à sacola</button>
        </div>
      )}
      {erro && <p className="-mt-3 text-sm text-vinho-600">{erro}</p>}

      {temWhats && (
        <button onClick={perguntar} className={`${esgotado ? 'btn-vinho' : 'btn-ouro'} w-full`}>
          {esgotado ? 'Avise-me quando chegar' : 'Comprar pelo WhatsApp'}
        </button>
      )}
      <button onClick={compartilhar} className="mx-auto flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-tinta/60 hover:text-vinho-700">
        <Share2 className="h-3.5 w-3.5" /> {copiado ? 'Link copiado!' : 'Compartilhar'}
      </button>
    </div>
  );
}

function isClaro(hex: string) {
  const h = hex.replace('#', ''); if (h.length < 6) return true;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}
