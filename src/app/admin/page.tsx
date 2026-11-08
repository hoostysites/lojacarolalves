'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Tags, Plus, AlertCircle } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import { brl } from '@/lib/format';
import type { Pedido } from '@/lib/types';
import { Cabecalho, Card } from './ui';

export default function Dashboard() {
  const sb = supabaseBrowser();
  const [d, setD] = useState({ produtos: 0, ativos: 0, categorias: 0, pedidosNovos: 0, semFoto: 0, whats: true });
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    (async () => {
      const [p, a, c, pn, sf, cfg, ul] = await Promise.all([
        sb.from('loja_produtos').select('id', { count: 'exact', head: true }),
        sb.from('loja_produtos').select('id', { count: 'exact', head: true }).eq('ativo', true),
        sb.from('loja_categorias').select('id', { count: 'exact', head: true }),
        sb.from('loja_pedidos').select('id', { count: 'exact', head: true }).eq('status', 'novo'),
        sb.from('loja_produtos').select('id', { count: 'exact', head: true }).eq('imagens', '{}'),
        sb.from('loja_config').select('whatsapp').eq('id', 1).single(),
        sb.from('loja_pedidos').select('*').order('created_at', { ascending: false }).limit(6),
      ]);
      setD({ produtos: p.count || 0, ativos: a.count || 0, categorias: c.count || 0, pedidosNovos: pn.count || 0, semFoto: sf.count || 0, whats: !!(cfg.data?.whatsapp || '').replace(/\D/g, '') });
      setPedidos((ul.data as Pedido[]) || []);
    })();
  }, [sb]);

  return (
    <>
      <Cabecalho titulo="Olá! 👋" sub="Resumo da sua loja virtual" acao={<Link href="/admin/produtos/novo" className="btn-vinho"><Plus className="h-4 w-4" />Novo produto</Link>} />
      {!d.whats && (
        <Link href="/admin/config" className="mb-6 flex items-center gap-3 border border-ouro-500 bg-ouro-300/20 p-4 text-sm text-vinho-800">
          <AlertCircle className="h-5 w-5 shrink-0" /> Cadastre o número de WhatsApp da loja para os pedidos chegarem até você. Clique aqui.
        </Link>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { t: 'Produtos', v: d.produtos, s: `${d.ativos} visíveis na loja`, i: Package, h: '/admin/produtos' },
          { t: 'Categorias', v: d.categorias, s: 'organizando a vitrine', i: Tags, h: '/admin/categorias' },
          { t: 'Pedidos novos', v: d.pedidosNovos, s: 'aguardando atendimento', i: ShoppingBag, h: '/admin/pedidos' },
          { t: 'Sem foto', v: d.semFoto, s: 'produtos para fotografar', i: AlertCircle, h: '/admin/produtos' },
        ].map(({ t, v, s, i: I, h }) => (
          <Link key={t} href={h}><Card className="transition hover:border-ouro-500">
            <div className="flex items-start justify-between"><p className="text-[11px] uppercase tracking-[0.18em] text-tinta/55">{t}</p><I className="h-5 w-5 text-ouro-600" /></div>
            <p className="mt-3 font-display text-4xl text-vinho-700">{v}</p><p className="mt-1 text-xs text-tinta/50">{s}</p>
          </Card></Link>
        ))}
      </div>
      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between"><p className="font-display text-lg text-vinho-800">Últimos pedidos</p><Link href="/admin/pedidos" className="text-xs uppercase tracking-wider text-vinho-600">Ver todos</Link></div>
        {pedidos.length === 0 ? <p className="py-8 text-center text-sm text-tinta/50">Os pedidos enviados pela sacola do site aparecem aqui.</p> : (
          <ul className="divide-y divide-creme-300">
            {pedidos.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                <div><p className="font-medium">{p.cliente_nome || 'Cliente sem nome'} <span className="ml-1 text-xs text-tinta/40">#{p.id.slice(0, 6).toUpperCase()}</span></p>
                  <p className="text-xs text-tinta/50">{new Date(p.created_at).toLocaleString('pt-BR')} · {p.itens.reduce((s, i) => s + i.qtd, 0)} itens</p></div>
                <p className="font-medium text-vinho-700">{brl(p.total)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
