import { cache } from 'react';
import { supabasePublic } from './supabase';
import type { Banner, Categoria, Config, Produto } from './types';

const SEL = '*, categoria:loja_categorias(nome, slug)';

const DEFAULT_CONFIG: Config = {
  nome: 'Carol Alves', slogan: 'Moda & Acessórios', whatsapp: '', instagram: 'lojacarolalves',
  endereco: 'Feira de Santana - BA', horario: '', aviso_topo: '', sobre: '',
};

export const getConfig = cache(async (): Promise<Config> => {
  const { data } = await supabasePublic().from('loja_config').select('*').eq('id', 1).maybeSingle();
  return { ...DEFAULT_CONFIG, ...(data || {}) };
});

export const getCategorias = cache(async (): Promise<Categoria[]> => {
  const { data } = await supabasePublic().from('loja_categorias').select('*').eq('ativo', true).order('ordem');
  return (data as Categoria[]) || [];
});

export const getBanners = cache(async (): Promise<Banner[]> => {
  const { data } = await supabasePublic().from('loja_banners').select('*').eq('ativo', true).order('ordem');
  return (data as Banner[]) || [];
});

export type FiltroProdutos = {
  categoriaId?: string; destaque?: boolean; novidade?: boolean; promo?: boolean;
  busca?: string; ordem?: string; limite?: number; excetoId?: string;
};

export const getProdutos = cache(async (f: FiltroProdutos = {}): Promise<Produto[]> => {
  let q = supabasePublic().from('loja_produtos').select(SEL).eq('ativo', true);
  if (f.categoriaId) q = q.eq('categoria_id', f.categoriaId);
  if (f.destaque) q = q.eq('destaque', true);
  if (f.novidade) q = q.eq('novidade', true);
  if (f.promo) q = q.not('preco_promocional', 'is', null);
  if (f.excetoId) q = q.neq('id', f.excetoId);
  if (f.busca) q = q.ilike('nome', `%${f.busca.replace(/[%,()]/g, ' ')}%`);
  switch (f.ordem) {
    case 'menor': q = q.order('preco', { ascending: true }); break;
    case 'maior': q = q.order('preco', { ascending: false }); break;
    case 'novos': q = q.order('created_at', { ascending: false }); break;
    default: q = q.order('ordem').order('created_at', { ascending: false });
  }
  if (f.limite) q = q.limit(f.limite);
  const { data } = await q;
  const lista = ((data as Produto[]) || []);
  // esgotados sempre por último
  return lista.sort((a, b) => Number(a.status === 'esgotado') - Number(b.status === 'esgotado'));
});

export const getProduto = cache(async (slug: string): Promise<Produto | null> => {
  const { data } = await supabasePublic().from('loja_produtos').select(SEL).eq('slug', slug).eq('ativo', true).maybeSingle();
  return (data as Produto) || null;
});
