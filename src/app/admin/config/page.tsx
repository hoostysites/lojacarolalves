'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { revalidar } from '@/lib/admin';
import type { Config } from '@/lib/types';
import { Cabecalho, Card } from '../ui';

const CAMPOS: { k: keyof Config; l: string; ph?: string; area?: boolean; dica?: string }[] = [
  { k: 'nome', l: 'Nome da loja' },
  { k: 'whatsapp', l: 'WhatsApp da loja', ph: '75 99999-9999', dica: 'Os pedidos da sacola são enviados para este número. Use DDD.' },
  { k: 'instagram', l: 'Instagram (sem @)', ph: 'lojacarolalves' },
  { k: 'endereco', l: 'Endereço', ph: 'Rua, número, bairro, cidade' },
  { k: 'horario', l: 'Horário de funcionamento' },
  { k: 'aviso_topo', l: 'Faixa de aviso no topo do site', dica: 'Deixe vazio para esconder.' },
  { k: 'sobre', l: 'Texto “Sobre a loja”', area: true },
];

export default function ConfigAdmin() {
  const sb = supabaseBrowser();
  const [c, setC] = useState<Config | null>(null); const [msg, setMsg] = useState('');
  useEffect(() => { sb.from('loja_config').select('*').eq('id', 1).single().then(({ data }) => setC(data as Config)); }, [sb]);
  if (!c) return <p className="py-10 text-center text-sm text-tinta/50">Carregando...</p>;

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    let w = (c.whatsapp || '').replace(/\D/g, '');
    if (w && !w.startsWith('55')) w = '55' + w;
    const { error } = await sb.from('loja_config').update({ ...c, whatsapp: w, instagram: (c.instagram || '').replace('@', '').trim(), updated_at: new Date().toISOString() }).eq('id', 1);
    setC({ ...c, whatsapp: w });
    setMsg(error ? 'Erro ao salvar.' : 'Configurações salvas! A loja já foi atualizada.'); revalidar();
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <form onSubmit={salvar}>
      <Cabecalho titulo="Configurações" sub="Informações que aparecem no site" acao={<button className="btn-vinho">Salvar</button>} />
      {msg && <p className="mb-4 border border-green-200 bg-green-50 p-3 text-sm text-green-800">{msg}</p>}
      <Card className="grid gap-5 md:grid-cols-2">
        {CAMPOS.map(({ k, l, ph, area, dica }) => (
          <div key={k} className={area ? 'md:col-span-2' : ''}>
            <label className="label">{l}</label>
            {area ? <textarea rows={5} value={(c[k] as string) || ''} onChange={(e) => setC({ ...c, [k]: e.target.value })} className="input" />
              : <input value={(c[k] as string) || ''} placeholder={ph} onChange={(e) => setC({ ...c, [k]: e.target.value })} className="input" />}
            {dica && <p className="mt-1 text-xs text-tinta/50">{dica}</p>}
          </div>
        ))}
      </Card>
    </form>
  );
}
