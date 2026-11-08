'use client';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import { brl } from '@/lib/format';
import type { Pedido } from '@/lib/types';
import { Cabecalho, Card } from '../ui';

const ST: Record<Pedido['status'], [string, string]> = {
  novo: ['Novo', 'bg-ouro-300/40 text-vinho-800'], em_atendimento: ['Em atendimento', 'bg-blue-100 text-blue-800'],
  concluido: ['Concluído', 'bg-green-100 text-green-800'], cancelado: ['Cancelado', 'bg-gray-100 text-gray-600'],
};

export default function PedidosAdmin() {
  const sb = supabaseBrowser();
  const [lista, setLista] = useState<Pedido[]>([]); const [filtro, setFiltro] = useState('');
  useEffect(() => { sb.from('loja_pedidos').select('*').order('created_at', { ascending: false }).limit(300).then(({ data }) => setLista((data as Pedido[]) || [])); }, [sb]);
  const mudar = async (id: string, status: Pedido['status']) => { setLista((l) => l.map((p) => (p.id === id ? { ...p, status } : p))); await sb.from('loja_pedidos').update({ status }).eq('id', id); };
  const apagar = async (id: string) => { if (!confirm('Excluir este pedido?')) return; await sb.from('loja_pedidos').delete().eq('id', id); setLista((l) => l.filter((p) => p.id !== id)); };
  const vis = lista.filter((p) => !filtro || p.status === filtro);
  const totalConcl = lista.filter((p) => p.status === 'concluido').reduce((s, p) => s + Number(p.total), 0);

  return (
    <>
      <Cabecalho titulo="Pedidos" sub={`Pedidos enviados pela sacola do site · ${brl(totalConcl)} concluídos`} />
      <div className="mb-4 flex flex-wrap gap-2">
        {[['', 'Todos'], ...Object.entries(ST).map(([k, v]) => [k, v[0]])].map(([k, l]) => (
          <button key={k} onClick={() => setFiltro(k)} className={`border px-3 py-1.5 text-xs ${filtro === k ? 'border-vinho-700 bg-vinho-700 text-white' : 'border-creme-300 bg-white'}`}>{l}</button>
        ))}
      </div>
      <div className="space-y-3">
        {vis.map((p) => (
          <Card key={p.id} className="!p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{p.cliente_nome || 'Cliente sem nome'} <span className="ml-1 text-xs text-tinta/40">#{p.id.slice(0, 6).toUpperCase()}</span></p>
                <p className="text-xs text-tinta/50">{new Date(p.created_at).toLocaleString('pt-BR')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-[11px] ${ST[p.status][1]}`}>{ST[p.status][0]}</span>
                <select value={p.status} onChange={(e) => mudar(p.id, e.target.value as Pedido['status'])} className="border border-creme-300 bg-white px-2 py-1 text-xs">
                  {Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}
                </select>
                <button onClick={() => apagar(p.id)} className="p-1.5 text-tinta/40 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <ul className="mt-3 space-y-1 border-t border-creme-300 pt-3 text-sm">
              {p.itens.map((i) => <li key={i.key} className="flex justify-between"><span>{i.qtd}x {i.nome} <span className="text-tinta/50">{[i.tamanho, i.cor].filter(Boolean).join(' · ')}</span></span><span>{brl(i.preco * i.qtd)}</span></li>)}
            </ul>
            {p.observacao && <p className="mt-2 text-xs italic text-tinta/60">Obs.: {p.observacao}</p>}
            <p className="mt-2 text-right font-display text-lg text-vinho-700">{brl(p.total)}</p>
          </Card>
        ))}
        {!vis.length && <p className="py-12 text-center text-sm text-tinta/50">Nenhum pedido por aqui ainda.</p>}
      </div>
    </>
  );
}
