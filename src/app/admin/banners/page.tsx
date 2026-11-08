'use client';
import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import { revalidar } from '@/lib/admin';
import type { Banner } from '@/lib/types';
import { Cabecalho, Card, Imagens, Toggle } from '../ui';

export default function BannersAdmin() {
  const sb = supabaseBrowser();
  const [lista, setLista] = useState<Banner[]>([]);
  const [salvo, setSalvo] = useState<string | null>(null);
  const carregar = () => sb.from('loja_banners').select('*').order('ordem').then(({ data }) => setLista((data as Banner[]) || []));
  useEffect(() => { carregar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const alterar = (id: string, b: Partial<Banner>) => setLista((l) => l.map((x) => (x.id === id ? { ...x, ...b } : x)));
  const salvar = async (b: Banner) => {
    const { id, ...resto } = b;
    await sb.from('loja_banners').update(resto).eq('id', id); setSalvo(id); setTimeout(() => setSalvo(null), 1800); revalidar();
  };
  const novo = async () => { await sb.from('loja_banners').insert({ titulo: 'Novo banner', ordem: lista.length + 1 }); carregar(); };
  const apagar = async (b: Banner) => { if (!confirm('Excluir este banner?')) return; await sb.from('loja_banners').delete().eq('id', b.id); carregar(); revalidar(); };

  return (
    <>
      <Cabecalho titulo="Banners" sub="Carrossel do topo da página inicial. Sem foto, aparece a arte da marca." acao={<button onClick={novo} className="btn-vinho"><Plus className="h-4 w-4" />Novo banner</button>} />
      <div className="space-y-5">
        {lista.map((b) => (
          <Card key={b.id} className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <div><p className="label">Desktop (1920x900)</p><Imagens valor={b.imagem_url ? [b.imagem_url] : []} onChange={(v) => alterar(b.id, { imagem_url: v[0] || null })} pasta="banners" multiplo={false} proporcao="aspect-[16/8]" max={2200} /></div>
              <div><p className="label">Celular (opcional)</p><Imagens valor={b.imagem_mobile_url ? [b.imagem_mobile_url] : []} onChange={(v) => alterar(b.id, { imagem_mobile_url: v[0] || null })} pasta="banners" multiplo={false} proporcao="aspect-[9/14]" max={1200} /></div>
            </div>
            <div className="space-y-2">
              <input value={b.titulo || ''} onChange={(e) => alterar(b.id, { titulo: e.target.value })} placeholder="Título" className="input !py-2" />
              <textarea rows={2} value={b.subtitulo || ''} onChange={(e) => alterar(b.id, { subtitulo: e.target.value })} placeholder="Subtítulo" className="input !py-2" />
              <div className="grid grid-cols-2 gap-2">
                <input value={b.cta_texto || ''} onChange={(e) => alterar(b.id, { cta_texto: e.target.value })} placeholder="Texto do botão" className="input !py-2" />
                <input value={b.cta_link || ''} onChange={(e) => alterar(b.id, { cta_link: e.target.value })} placeholder="/produtos" className="input !py-2" />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <input type="number" value={b.ordem} onChange={(e) => alterar(b.id, { ordem: parseInt(e.target.value) || 0 })} className="input !w-16 !px-2 !py-1.5" title="Ordem" />
                <Toggle checked={b.ativo} onChange={(v) => alterar(b.id, { ativo: v })} label="Ativo" />
                <span className="flex-1" />
                <button onClick={() => apagar(b)} className="p-2 text-tinta/50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                <button onClick={() => salvar(b)} className="btn-vinho !px-4 !py-2"><Save className="h-3.5 w-3.5" />{salvo === b.id ? 'Salvo!' : 'Salvar'}</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
