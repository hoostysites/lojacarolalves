'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ItemSacola } from '@/lib/types';

type Ctx = {
  itens: ItemSacola[]; aberta: boolean; qtdTotal: number; total: number;
  abrir: () => void; fechar: () => void;
  adicionar: (i: Omit<ItemSacola, 'key' | 'qtd'>, qtd?: number) => void;
  alterarQtd: (key: string, qtd: number) => void;
  remover: (key: string) => void; limpar: () => void;
};
const SacolaCtx = createContext<Ctx | null>(null);
const KEY = 'carolalves:sacola';

export function SacolaProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemSacola[]>([]);
  const [aberta, setAberta] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setItens(JSON.parse(s)); } catch {}
    setPronto(true);
  }, []);
  useEffect(() => {
    if (!pronto) return;
    try { localStorage.setItem(KEY, JSON.stringify(itens)); } catch {}
  }, [itens, pronto]);
  useEffect(() => {
    document.body.style.overflow = aberta ? 'hidden' : '';
  }, [aberta]);

  const adicionar = useCallback<Ctx['adicionar']>((i, qtd = 1) => {
    const key = `${i.produtoId}|${i.tamanho ?? ''}|${i.cor ?? ''}`;
    setItens((prev) => {
      const ex = prev.find((p) => p.key === key);
      if (ex) return prev.map((p) => (p.key === key ? { ...p, qtd: p.qtd + qtd } : p));
      return [...prev, { ...i, key, qtd }];
    });
    setAberta(true);
  }, []);

  const value = useMemo<Ctx>(() => ({
    itens, aberta,
    qtdTotal: itens.reduce((s, i) => s + i.qtd, 0),
    total: itens.reduce((s, i) => s + i.qtd * i.preco, 0),
    abrir: () => setAberta(true), fechar: () => setAberta(false),
    adicionar,
    alterarQtd: (key, qtd) => setItens((p) => p.map((i) => (i.key === key ? { ...i, qtd: Math.max(1, qtd) } : i))),
    remover: (key) => setItens((p) => p.filter((i) => i.key !== key)),
    limpar: () => setItens([]),
  }), [itens, aberta, adicionar]);

  return <SacolaCtx.Provider value={value}>{children}</SacolaCtx.Provider>;
}

export const useSacola = () => {
  const c = useContext(SacolaCtx);
  if (!c) throw new Error('useSacola fora do provider');
  return c;
};
