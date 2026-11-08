'use client';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from 'lucide-react';
import { uploadImagem } from '@/lib/admin';

export function Cabecalho({ titulo, sub, acao }: { titulo: string; sub?: string; acao?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="font-display text-2xl tracking-[0.06em] text-vinho-800 md:text-3xl">{titulo}</h1>{sub && <p className="mt-1 text-sm text-tinta/55">{sub}</p>}</div>
      {acao}
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`border border-creme-300 bg-white p-5 md:p-6 ${className}`}>{children}</div>;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm">
      <button type="button" onClick={() => onChange(!checked)} className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-vinho-700' : 'bg-creme-300'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
      {label}
    </label>
  );
}

/** Upload múltiplo com reordenação. */
export function Imagens({ valor, onChange, pasta, multiplo = true, proporcao = 'aspect-[3/4]', max = 1600 }: {
  valor: string[]; onChange: (v: string[]) => void; pasta: string; multiplo?: boolean; proporcao?: string; max?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [subindo, setSubindo] = useState(0);
  const [erro, setErro] = useState('');

  const enviar = async (files: FileList | null) => {
    if (!files?.length) return;
    setErro(''); const lista = Array.from(files).slice(0, multiplo ? 12 : 1);
    setSubindo(lista.length);
    const urls: string[] = [];
    for (const f of lista) {
      try { urls.push(await uploadImagem(f, pasta, max)); } catch (e) { setErro('Falha ao enviar uma imagem. Tente de novo.'); }
      setSubindo((s) => s - 1);
    }
    onChange(multiplo ? [...valor, ...urls] : urls.slice(0, 1));
    if (ref.current) ref.current.value = '';
  };
  const mover = (i: number, d: number) => {
    const v = [...valor]; const j = i + d; if (j < 0 || j >= v.length) return;
    [v[i], v[j]] = [v[j], v[i]]; onChange(v);
  };

  return (
    <div>
      <div className={`grid gap-3 ${multiplo ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5' : 'grid-cols-1'}`}>
        {valor.map((u, i) => (
          <div key={u} className={`group relative overflow-hidden border border-creme-300 bg-creme-200 ${proporcao}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            {multiplo && i === 0 && <span className="absolute left-1.5 top-1.5 bg-vinho-700 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white">Capa</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/55 p-1 opacity-0 transition group-hover:opacity-100 max-md:opacity-100">
              {multiplo ? <button type="button" onClick={() => mover(i, -1)} className="p-1 text-white"><ArrowLeft className="h-3.5 w-3.5" /></button> : <span />}
              <button type="button" onClick={() => onChange(valor.filter((x) => x !== u))} className="p-1 text-white"><X className="h-3.5 w-3.5" /></button>
              {multiplo ? <button type="button" onClick={() => mover(i, 1)} className="p-1 text-white"><ArrowRight className="h-3.5 w-3.5" /></button> : <span />}
            </div>
          </div>
        ))}
        {(multiplo || valor.length === 0) && (
          <button type="button" onClick={() => ref.current?.click()} disabled={subindo > 0}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-creme-300 text-tinta/50 transition hover:border-ouro-500 hover:text-vinho-700 ${proporcao}`}>
            {subindo > 0 ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
            <span className="text-[11px] uppercase tracking-wider">{subindo > 0 ? `Enviando ${subindo}` : 'Adicionar'}</span>
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" multiple={multiplo} hidden onChange={(e) => enviar(e.target.files)} />
      {erro && <p className="mt-2 text-xs text-red-600">{erro}</p>}
    </div>
  );
}
