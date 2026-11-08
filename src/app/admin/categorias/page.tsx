'use client';
import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import { slugify } from '@/lib/format';
import { revalidar } from '@/lib/admin';
import type { Categoria } from '@/lib/types';
import { Cabecalho, Card, Imagens, Toggle } from '../ui';

export default function CategoriasAdmin() {
  const sb = supabaseBrowser();
  const [lista, setLista] = useState<Categoria[]>([]);
  const [salvo, setSalvo] = useState<string | null>(null);
  const carregar = () => sb.from('loja_categorias').select('*').order('ordem').then(({ data }) => setLista((data as Categoria[]) || []));
  useEffect(() => { carregar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const alterar = (id: string, c: Partial<Categoria>) => setLista((l) => l.map((x) => (x.id === id ? { ...x, ...c } : x)));
  const salvar = async (c: Categoria) => {
    const { error } = await sb.from('loja_categorias').update({ nome: c.nome, slug: slugify(c.slug || c.nome), descricao: c.descricao, imagem_url: c.imagem_url, ordem: c.ordem, ativo: c.ativo }).eq('id', c.id);
    if (error) return alert(error.code === '23505' ? 'Já existe uma categoria com esse link.' : error.message);
    setSalvo(c.id); setTimeout(() => setSalvo(null), 1800); revalidar();
  };
  const nova = async () => {
    const nome = prompt('Nome da nova categoria'); if (!nome) return;
    await sb.from('loja_categorias').insert({ nome, slug: slugify(nome), ordem: lista.length + 1 }); carregar(); revalidar();
  };
  const apagar = async (c: Categoria) => {
    if (!confirm(`Excluir a categoria "${c.nome}"? Os produtos dela ficam sem categoria.`)) return;
    await sb.from('loja_categorias').delete().eq('id', c.id); carregar(); revalidar();
  };

  return (
    <>
      <Cabecalho titulo="Categorias" sub="Aparecem no menu e na página inicial" acao={<button onClick={nova} className="btn-vinho"><Plus className="h-4 w-4" />Nova categoria</button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {lista.map((c) => (
          <Card key={c.id} className="flex gap-4">
            <div className="w-28 shrink-0"><Imagens valor={c.imagem_url ? [c.imagem_url] : []} onChange={(v) => alterar(c.id, { imagem_url: v[0] || null })} pasta="categorias" multiplo={false} max={1000} /></div>
            <div className="flex-1 space-y-2">
              <input value={c.nome} onChange={(e) => alterar(c.id, { nome: e.target.value })} className="input !py-2 font-medium" />
              <input value={c.descricao || ''} onChange={(e) => alterar(c.id, { descricao: e.target.value })} placeholder="Frase da categoria" className="input !py-2 text-xs" />
              <div className="flex items-center gap-2">
                <label className="text-xs text-tinta/50">Ordem</label>
                <input type="number" value={c.ordem} onChange={(e) => alterar(c.id, { ordem: parseInt(e.target.value) || 0 })} className="input !w-16 !px-2 !py-1.5" />
                <Toggle checked={c.ativo} onChange={(v) => alterar(c.id, { ativo: v })} label="Ativa" />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => salvar(c)} className="btn-vinho !px-4 !py-2"><Save className="h-3.5 w-3.5" />{salvo === c.id ? 'Salvo!' : 'Salvar'}</button>
                <button onClick={() => apagar(c)} className="p-2 text-tinta/50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
