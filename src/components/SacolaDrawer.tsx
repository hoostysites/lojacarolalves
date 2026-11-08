'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useSacola } from './SacolaProvider';
import { ImagemProduto } from './ImagemProduto';
import { brl, waLink } from '@/lib/format';
import { supabaseBrowser } from '@/lib/supabase';
import type { Config } from '@/lib/types';

export function SacolaDrawer({ config }: { config: Config }) {
  const { itens, aberta, fechar, total, alterarQtd, remover, limpar, qtdTotal } = useSacola();
  const [nome, setNome] = useState('');
  const [obs, setObs] = useState('');
  const [enviando, setEnviando] = useState(false);
  const temWhats = !!(config.whatsapp || '').replace(/\D/g, '');

  const finalizar = async () => {
    if (!itens.length || !temWhats) return;
    setEnviando(true);
    let codigo = '';
    try {
      const id = crypto.randomUUID();
      const req = supabaseBrowser().from('loja_pedidos').insert({
        id, cliente_nome: nome || null, itens, total, observacao: obs || null,
      });
      const r = await Promise.race([req, new Promise((res) => setTimeout(() => res(null), 2500))]);
      if (r && !(r as { error: unknown }).error) codigo = id.slice(0, 6).toUpperCase();
    } catch {}
    const linhas = itens.map((i) => {
      const det = [i.tamanho && `Tam. ${i.tamanho}`, i.cor && `Cor ${i.cor}`].filter(Boolean).join(', ');
      return `• ${i.qtd}x ${i.nome}${det ? ` (${det})` : ''}: ${brl(i.preco * i.qtd)}`;
    });
    const msg: string[] = [
      `Olá, ${config.nome}! ✨ Vim pelo site e quero fazer este pedido:`,
      '',
      ...linhas,
      '',
      `*Total: ${brl(total)}*`,
    ];
    if (nome) msg.push(`Nome: ${nome}`);
    if (obs) msg.push(`Obs.: ${obs}`);
    if (codigo) msg.push(`Pedido #${codigo}`);
    window.location.href = waLink(config.whatsapp, msg.join('\n'));
    setEnviando(false);
    limpar();
    fechar();
  };

  return (
    <div className={`fixed inset-0 z-[60] ${aberta ? '' : 'pointer-events-none'}`} aria-hidden={!aberta}>
      <div onClick={fechar} className={`absolute inset-0 bg-vinho-950/60 backdrop-blur-[2px] transition-opacity duration-500 ${aberta ? 'opacity-100' : 'opacity-0'}`} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-creme-100 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${aberta ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between bg-vinho-900 px-6 py-5 text-creme-100">
          <div>
            <p className="font-display text-lg tracking-[0.15em]">Minha Sacola</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ouro-300">{qtdTotal} {qtdTotal === 1 ? 'item' : 'itens'}</p>
          </div>
          <button onClick={fechar} aria-label="Fechar sacola" className="p-1 hover:text-ouro-300"><X className="h-5 w-5" /></button>
        </div>

        {itens.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <ShoppingBag className="h-12 w-12 text-ouro-500" strokeWidth={1} />
            <p className="font-serif text-2xl italic text-vinho-700">Sua sacola está vazia</p>
            <p className="text-sm text-tinta/60">Escolha suas peças favoritas e finalize o pedido direto com a gente no WhatsApp.</p>
            <Link href="/produtos" onClick={fechar} className="btn-vinho mt-2">Explorar a loja</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-creme-300 overflow-y-auto px-6">
              {itens.map((i) => (
                <li key={i.key} className="flex gap-4 py-5">
                  <Link href={`/produto/${i.slug}`} onClick={fechar} className="h-28 w-[84px] shrink-0 overflow-hidden bg-creme-200">
                    <ImagemProduto src={i.imagem} alt={i.nome} mini />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="font-serif text-lg leading-tight text-vinho-800">{i.nome}</p>
                      <button onClick={() => remover(i.key)} className="text-tinta/40 hover:text-vinho-600" aria-label="Remover"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <p className="mt-1 text-xs text-tinta/55">{[i.tamanho && `Tam. ${i.tamanho}`, i.cor].filter(Boolean).join(' · ')}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-creme-300">
                        <button onClick={() => alterarQtd(i.key, i.qtd - 1)} className="p-2 hover:text-vinho-600" aria-label="Diminuir"><Minus className="h-3 w-3" /></button>
                        <span className="w-7 text-center text-sm">{i.qtd}</span>
                        <button onClick={() => alterarQtd(i.key, i.qtd + 1)} className="p-2 hover:text-vinho-600" aria-label="Aumentar"><Plus className="h-3 w-3" /></button>
                      </div>
                      <p className="font-medium text-vinho-700">{brl(i.preco * i.qtd)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-creme-300 bg-white px-6 py-5">
              <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome (opcional)" className="input" />
              <input value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Observação: retirada, entrega, dúvida..." className="input" />
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs uppercase tracking-[0.2em] text-tinta/60">Subtotal</span>
                <span className="font-display text-2xl text-vinho-700">{brl(total)}</span>
              </div>
              <button onClick={finalizar} disabled={enviando || !temWhats} className="btn-ouro w-full">
                {enviando ? 'Abrindo WhatsApp...' : 'Finalizar pelo WhatsApp'}
              </button>
              {!temWhats && <p className="text-center text-xs text-vinho-600">O WhatsApp da loja ainda não foi configurado no painel.</p>}
              <p className="text-center text-[11px] text-tinta/50">Você combina pagamento, entrega ou retirada direto com a gente.</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
