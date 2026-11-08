import type { MetadataRoute } from 'next';
import { getCategorias, getProdutos } from '@/lib/data';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://lojacarolalves.vercel.app';
  const [cats, prods] = await Promise.all([getCategorias(), getProdutos()]);
  return [
    { url: base, priority: 1 },
    { url: `${base}/produtos`, priority: 0.9 },
    ...cats.map((c) => ({ url: `${base}/categoria/${c.slug}`, priority: 0.8 })),
    ...prods.map((p) => ({ url: `${base}/produto/${p.slug}`, priority: 0.7 })),
  ];
}
