export const brl = (v: number | null | undefined) =>
  (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const precoFinal = (p: { preco: number; preco_promocional: number | null }) =>
  p.preco_promocional && p.preco_promocional < p.preco ? p.preco_promocional : p.preco;

export const descontoPct = (p: { preco: number; preco_promocional: number | null }) =>
  p.preco_promocional && p.preco_promocional < p.preco
    ? Math.round((1 - p.preco_promocional / p.preco) * 100) : 0;

export const parcelas = (v: number, max = 6, minParcela = 30) => {
  const n = Math.max(1, Math.min(max, Math.floor(v / minParcela)));
  return { n, valor: v / n };
};

export const waLink = (numero: string | null | undefined, msg: string) =>
  `https://wa.me/${(numero || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
