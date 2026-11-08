'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Copy, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import { brl, precoFinal } from '@/lib/format';
import { revalidar } from '@/lib/admin';
import type { Categoria, Produto } from '@/lib/types';
import { ImagemProduto } from '@/components/ImagemProduto';
import { Cabecalho, Card, Toggle } from '../ui';

const STATUS: Record<string, string> = { disponivel: 'Disponível', ultimas: 'Últimas peças', esgotado: 'Esgotado' };

export default function ProdutosAdmin() {
  const sb = supabaseBrowser();
  const [lista, setLista] = useState<Produto[]>([]);
  const [cats, setCats] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState(''); const [cat, setCat] = useState('');
  const [load, setLoad] = useState(true);

  const carregar = async () => {
    const [p, c] = await Promise.all([
      sb.from('loja_produtos').select('*, categoria:loja_categorias(nome, slug)').order('ordem').order('created_at', { ascending: false }),
      sb.from('loja_categorias').select('*').order('ordem'),
    ]);
    setLista((p.data as Produto[]) || []); setCats((c.data as Categoria[]) || []); setLoad(false);
  };
  useEffect(() => { carregar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtrada = useMemo(() => lista.filter((p) =>
    (!busca || p.nome.toLowerCase().includes(busca.toLowerCase())) && (!cat || p.categoria_id === cat)), [lista, busca, cat]);

  const atualizar = async (id: string, campos: Partial<Produto>) => {
    setLista((l) => l.map((p) => (p.id === id ? { ...p, ...campos } : p)));
    await sb.from('loja_produtos').update(campos).eq('id', id); revalidar();
  };
  const apagar = async (p: Produto) => {
    if (!confirm(`Excluir "${p.nome}"? Essa ação não pode ser desfeita.`)) return;
    await sb.from('loja_produtos').delete().eq('id', p.id); setLista((l) => l.filter((x) => x.id !== p.id)); revalidar();
  };
  const duplicar = async (p: Produto) => {
    const { id, created_at, categoria, ...resto } = p; void id; void created_at; void categoria;
    const { data } = await sb.from('loja_produtos').insert({ ...resto, nome: `${p.nome} (cópia)`, slug: `${p.slug}-${Date.now().toString(36)}`, ativo: false }).select('id').single();
    if (data) location.href = `/admin/produtos/${data.id}`;
  };

  return (
    <>
      <Cabecalho titulo="Produtos" sub={`${lista.length} cadastrados`} acao={<Link href="/admin/produtos/novo" className="btn-vinho"><Plus className="h-4 w-4" />Novo produto</Link>} />
      <Card className="mb-4 flex flex-col gap-3 !p-4 md:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tinta/40" /><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar produto" className="input pl-9" /></div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="input md:w-60"><option value="">Todas as categorias</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select>
      </Card>
      {load ? <p className="py-10 text-center text-sm text-tinta/50">Carregando...</p> : (
        <div className="space-y-2">
          {filtrada.map((p) => (
            <Card key={p.id} className="flex flex-wrap items-center gap-4 !p-3">
              <Link href={`/admin/produtos/${p.id}`} className="h-20 w-16 shrink-0 overflow-hidden bg-creme-200"><ImagemProduto src={p.imagens?.[0]} alt={p.nome} mini /></Link>
              <div className="min-w-[180px] flex-1">
                <Link href={`/admin/produtos/${p.id}`} className="font-medium hover:text-vinho-600">{p.nome}</Link>
                <p className="text-xs text-tinta/50">{p.categoria?.nome || 'Sem categoria'} · {brl(precoFinal(p))}{p.preco_promocional ? <span className="ml-1 line-through">{brl(p.preco)}</span> : null}</p>
                <select value={p.status} onChange={(e) => atualizar(p.id, { status: e.target.value as Produto['status'] })} className="mt-1.5 border border-creme-300 bg-white px-2 py-1 text-xs">
                  {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Toggle checked={p.ativo} onChange={(v) => atualizar(p.id, { ativo: v })} label="Visível" />
                <Toggle checked={p.destaque} onChange={(v) => atualizar(p.id, { destaque: v })} label="Destaque" />
                <Toggle checked={p.novidade} onChange={(v) => atualizar(p.id, { novidade: v })} label="Novo" />
              </div>
              <div className="flex gap-1">
                <Link href={`/admin/produtos/${p.id}`} className="p-2 text-tinta/60 hover:text-vinho-700" title="Editar"><Pencil className="h-4 w-4" /></Link>
                <button onClick={() => duplicar(p)} className="p-2 text-tinta/60 hover:text-vinho-700" title="Duplicar"><Copy className="h-4 w-4" /></button>
                <button onClick={() => apagar(p)} className="p-2 text-tinta/60 hover:text-red-600" title="Excluir"><Trash2 className="h-4 w-4" /></button>
              </div>
            </Card>
          ))}
          {!filtrada.length && <p className="py-10 text-center text-sm text-tinta/50">Nenhum produto encontrado.</p>}
        </div>
      )}
    </>
  );
}
