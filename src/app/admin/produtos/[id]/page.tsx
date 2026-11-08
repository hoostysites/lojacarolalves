'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import { slugify } from '@/lib/format';
import { revalidar } from '@/lib/admin';
import type { Categoria, Cor, Produto } from '@/lib/types';
import { Cabecalho, Card, Imagens, Toggle } from '../../ui';

const TAMANHOS_PADRAO = [['PP', 'P', 'M', 'G', 'GG'], ['36', '38', '40', '42', '44', '46'], ['Único']];
const CORES_RAPIDAS: Cor[] = [
  { nome: 'Preto', hex: '#111111' }, { nome: 'Branco', hex: '#FFFFFF' }, { nome: 'Off White', hex: '#F3EDE2' },
  { nome: 'Nude', hex: '#D9B8A0' }, { nome: 'Bordô', hex: '#5A0F1F' }, { nome: 'Vermelho', hex: '#B3172B' },
  { nome: 'Rosa', hex: '#E7B7B5' }, { nome: 'Azul', hex: '#24467A' }, { nome: 'Verde', hex: '#3E6B48' },
  { nome: 'Caramelo', hex: '#A8693A' }, { nome: 'Dourado', hex: '#C9A24A' }, { nome: 'Prata', hex: '#BFC3C7' },
];

type Form = Omit<Produto, 'id' | 'created_at' | 'categoria' | 'preco' | 'preco_promocional'> & { preco: string; preco_promocional: string };
const VAZIO: Form = { nome: '', slug: '', descricao: '', preco: '', preco_promocional: '', categoria_id: null, tamanhos: [], cores: [], imagens: [], destaque: false, novidade: true, status: 'disponivel', ativo: true, ordem: 0 };

export default function EditarProduto({ params }: { params: { id: string } }) {
  const novo = params.id === 'novo';
  const sb = supabaseBrowser(); const router = useRouter();
  const [f, setF] = useState<Form>(VAZIO);
  const [cats, setCats] = useState<Categoria[]>([]);
  const [slugManual, setSlugManual] = useState(!novo);
  const [tamNovo, setTamNovo] = useState('');
  const [cor, setCor] = useState<Cor>({ nome: '', hex: '#5A0F1F' });
  const [salvando, setSalvando] = useState(false); const [msg, setMsg] = useState('');

  useEffect(() => {
    sb.from('loja_categorias').select('*').order('ordem').then(({ data }) => setCats((data as Categoria[]) || []));
    if (!novo) sb.from('loja_produtos').select('*').eq('id', params.id).single().then(({ data }) => {
      if (data) setF({ ...(data as Produto), preco: String(data.preco ?? ''), preco_promocional: data.preco_promocional ? String(data.preco_promocional) : '', descricao: data.descricao || '' });
    });
  }, [sb, novo, params.id]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));
  const num = (s: string) => { const n = parseFloat(s.replace(/\./g, '').replace(',', '.')); return isNaN(n) ? null : n; };
  const toggleTam = (t: string) => set('tamanhos', f.tamanhos.includes(t) ? f.tamanhos.filter((x) => x !== t) : [...f.tamanhos, t]);
  const addCor = (c: Cor) => { if (!c.nome.trim() || f.cores.some((x) => x.nome === c.nome)) return; set('cores', [...f.cores, { nome: c.nome.trim(), hex: c.hex }]); };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('');
    const preco = num(f.preco); if (preco === null) { setMsg('Informe o preço.'); return; }
    const promo = f.preco_promocional ? num(f.preco_promocional) : null;
    if (promo !== null && promo >= preco) { setMsg('O preço promocional precisa ser menor que o preço normal.'); return; }
    setSalvando(true);
    const payload = { ...f, slug: slugify(f.slug || f.nome), preco, preco_promocional: promo, descricao: f.descricao || null, updated_at: new Date().toISOString() };
    const r = novo ? await sb.from('loja_produtos').insert(payload).select('id').single() : await sb.from('loja_produtos').update(payload).eq('id', params.id).select('id').single();
    setSalvando(false);
    if (r.error) { setMsg(r.error.code === '23505' ? 'Já existe um produto com esse link. Mude o nome ou o link.' : 'Erro ao salvar: ' + r.error.message); return; }
    await revalidar();
    router.push('/admin/produtos');
  };

  return (
    <form onSubmit={salvar}>
      <Link href="/admin/produtos" className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-tinta/60 hover:text-vinho-700"><ArrowLeft className="h-3.5 w-3.5" />Produtos</Link>
      <Cabecalho titulo={novo ? 'Novo produto' : 'Editar produto'} acao={<button disabled={salvando} className="btn-vinho">{salvando ? 'Salvando...' : 'Salvar produto'}</button>} />
      {msg && <p className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{msg}</p>}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card>
            <p className="label">Fotos (a primeira é a capa; arraste com as setas)</p>
            <Imagens valor={f.imagens} onChange={(v) => set('imagens', v)} pasta="produtos" />
            <p className="mt-2 text-xs text-tinta/50">Dica: fotos verticais (3:4) ficam perfeitas na vitrine. As imagens são otimizadas automaticamente.</p>
          </Card>
          <Card className="space-y-4">
            <div><label className="label">Nome do produto</label><input required value={f.nome} onChange={(e) => { set('nome', e.target.value); if (!slugManual) set('slug', slugify(e.target.value)); }} className="input" placeholder="Ex: Vestido Midi Bordô" /></div>
            <div><label className="label">Link (endereço da página)</label>
              <div className="flex items-center"><span className="border border-r-0 border-creme-300 bg-creme-200 px-3 py-3 text-xs text-tinta/50">/produto/</span><input value={f.slug} onChange={(e) => { setSlugManual(true); set('slug', slugify(e.target.value)); }} className="input" /></div></div>
            <div><label className="label">Descrição</label><textarea rows={5} value={f.descricao || ''} onChange={(e) => set('descricao', e.target.value)} className="input" placeholder="Tecido, modelagem, ocasião, medidas..." /></div>
          </Card>
          <Card className="space-y-4">
            <p className="label">Tamanhos</p>
            {TAMANHOS_PADRAO.map((g, i) => (
              <div key={i} className="flex flex-wrap gap-2">{g.map((t) => (
                <button type="button" key={t} onClick={() => toggleTam(t)} className={`h-10 min-w-[44px] border px-3 text-sm ${f.tamanhos.includes(t) ? 'border-vinho-700 bg-vinho-700 text-white' : 'border-creme-300 bg-white'}`}>{t}</button>
              ))}</div>
            ))}
            <div className="flex gap-2"><input value={tamNovo} onChange={(e) => setTamNovo(e.target.value)} placeholder="Outro tamanho" className="input" />
              <button type="button" onClick={() => { if (tamNovo.trim() && !f.tamanhos.includes(tamNovo.trim())) set('tamanhos', [...f.tamanhos, tamNovo.trim()]); setTamNovo(''); }} className="btn-linha !px-4"><Plus className="h-4 w-4" /></button></div>
            {f.tamanhos.length > 0 && <p className="text-xs text-tinta/60">Selecionados: {f.tamanhos.join(', ')}</p>}
          </Card>
          <Card className="space-y-4">
            <p className="label">Cores</p>
            <div className="flex flex-wrap gap-2">
              {f.cores.map((c) => (
                <span key={c.nome} className="flex items-center gap-2 border border-creme-300 bg-white py-1.5 pl-2 pr-1 text-sm">
                  <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: c.hex }} />{c.nome}
                  <button type="button" onClick={() => set('cores', f.cores.filter((x) => x.nome !== c.nome))} className="p-0.5 text-tinta/40 hover:text-red-600"><X className="h-3.5 w-3.5" /></button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {CORES_RAPIDAS.filter((c) => !f.cores.some((x) => x.nome === c.nome)).map((c) => (
                <button type="button" key={c.nome} onClick={() => addCor(c)} title={`Adicionar ${c.nome}`} className="flex items-center gap-1.5 border border-dashed border-creme-300 px-2 py-1 text-xs text-tinta/60 hover:border-vinho-700">
                  <span className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: c.hex }} />{c.nome}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="color" value={cor.hex} onChange={(e) => setCor({ ...cor, hex: e.target.value })} className="h-12 w-14 cursor-pointer border border-creme-300" />
              <input value={cor.nome} onChange={(e) => setCor({ ...cor, nome: e.target.value })} placeholder="Nome da cor personalizada" className="input" />
              <button type="button" onClick={() => { addCor(cor); setCor({ ...cor, nome: '' }); }} className="btn-linha !px-4"><Plus className="h-4 w-4" /></button>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="space-y-4">
            <div><label className="label">Preço (R$)</label><input required inputMode="decimal" value={f.preco} onChange={(e) => set('preco', e.target.value)} className="input" placeholder="189,90" /></div>
            <div><label className="label">Preço promocional (opcional)</label><input inputMode="decimal" value={f.preco_promocional} onChange={(e) => set('preco_promocional', e.target.value)} className="input" placeholder="159,90" /></div>
          </Card>
          <Card className="space-y-4">
            <div><label className="label">Categoria</label>
              <select value={f.categoria_id || ''} onChange={(e) => set('categoria_id', e.target.value || null)} className="input"><option value="">Sem categoria</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
            <div><label className="label">Disponibilidade</label>
              <select value={f.status} onChange={(e) => set('status', e.target.value as Form['status'])} className="input"><option value="disponivel">Disponível</option><option value="ultimas">Últimas peças</option><option value="esgotado">Esgotado</option></select></div>
            <div><label className="label">Ordem na vitrine (menor aparece antes)</label><input type="number" value={f.ordem} onChange={(e) => set('ordem', parseInt(e.target.value) || 0)} className="input" /></div>
          </Card>
          <Card className="space-y-4">
            <Toggle checked={f.ativo} onChange={(v) => set('ativo', v)} label="Visível na loja" />
            <Toggle checked={f.destaque} onChange={(v) => set('destaque', v)} label="Mostrar em “Queridinhos da loja”" />
            <Toggle checked={f.novidade} onChange={(v) => set('novidade', v)} label="Marcar como novidade" />
          </Card>
          <button disabled={salvando} className="btn-vinho w-full">{salvando ? 'Salvando...' : 'Salvar produto'}</button>
        </div>
      </div>
    </form>
  );
}
