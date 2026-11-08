'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function Ordenacao() {
  const router = useRouter(); const path = usePathname(); const sp = useSearchParams();
  const atual = sp.get('ordem') || '';
  return (
    <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-tinta/60">
      Ordenar
      <select value={atual} onChange={(e) => {
        const p = new URLSearchParams(sp.toString());
        e.target.value ? p.set('ordem', e.target.value) : p.delete('ordem');
        router.push(`${path}?${p.toString()}`, { scroll: false });
      }} className="border border-creme-300 bg-white px-3 py-2 text-xs normal-case tracking-normal text-tinta outline-none focus:border-ouro-500">
        <option value="">Em destaque</option>
        <option value="novos">Mais recentes</option>
        <option value="menor">Menor preço</option>
        <option value="maior">Maior preço</option>
      </select>
    </label>
  );
}
