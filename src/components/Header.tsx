'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { Instagram } from './IconeInstagram';
import { Wordmark } from './Wordmark';
import { useSacola } from './SacolaProvider';
import type { Categoria, Config } from '@/lib/types';

export function Header({ categorias, config }: { categorias: Categoria[]; config: Config }) {
  const { qtdTotal, abrir } = useSacola();
  const [rolou, setRolou] = useState(false);
  const [menu, setMenu] = useState(false);
  const [busca, setBusca] = useState(false);
  const [termo, setTermo] = useState('');
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const on = () => setRolou(window.scrollY > 40);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setMenu(false); setBusca(false); }, [path]);

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (termo.trim()) router.push(`/produtos?busca=${encodeURIComponent(termo.trim())}`);
  };

  const links = [
    { href: '/produtos?filtro=novidades', label: 'Novidades' },
    ...categorias.map((c) => ({ href: `/categoria/${c.slug}`, label: c.nome })),
    { href: '/produtos?filtro=promocoes', label: 'Promoções', destaque: true },
  ];

  return (
    <>
      {config.aviso_topo && (
        <div className="overflow-hidden bg-vinho-950 py-2 text-ouro-300">
          <div className="flex w-max animate-marquee whitespace-nowrap text-[11px] uppercase tracking-[0.25em]">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 px-8">
                {config.aviso_topo}<span className="text-ouro-500">✦</span>
              </span>
            ))}
          </div>
        </div>
      )}
      <header className={`sticky top-0 z-40 border-b border-ouro-500/20 bg-vinho-900/95 text-creme-100 backdrop-blur-md transition-shadow ${rolou ? 'shadow-[0_10px_30px_-12px_rgba(0,0,0,.6)]' : ''}`}>
        <div className={`container-luxo grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-500 ${rolou ? 'h-16' : 'h-20 md:h-24'}`}>
          <div className="flex items-center gap-1">
            <button onClick={() => setMenu(true)} className="p-2 lg:hidden" aria-label="Abrir menu"><Menu className="h-5 w-5" /></button>
            <button onClick={() => setBusca((b) => !b)} className="p-2 text-creme-100/90 hover:text-ouro-300" aria-label="Buscar"><Search className="h-5 w-5" /></button>
          </div>
          <Wordmark compacto={rolou} />
          <div className="flex items-center justify-end gap-1">
            {config.instagram && (
              <a href={`https://instagram.com/${config.instagram}`} target="_blank" rel="noreferrer" className="hidden p-2 hover:text-ouro-300 sm:block" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
            )}
            <button onClick={abrir} className="relative p-2 hover:text-ouro-300" aria-label="Abrir sacola">
              <ShoppingBag className="h-5 w-5" />
              {qtdTotal > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ouro-500 px-1 text-[10px] font-semibold text-vinho-900">{qtdTotal}</span>
              )}
            </button>
          </div>
        </div>
        <nav className={`hidden border-t border-ouro-500/10 lg:block ${rolou ? 'lg:hidden' : ''}`}>
          <ul className="container-luxo flex h-12 items-center justify-center gap-9">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`link-sub text-[11.5px] uppercase tracking-[0.22em] transition-colors hover:text-ouro-300 ${l.destaque ? 'text-ouro-400' : 'text-creme-100/85'}`}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        {busca && (
          <form onSubmit={buscar} className="border-t border-ouro-500/15 bg-vinho-950/90">
            <div className="container-luxo flex items-center gap-3 py-3">
              <Search className="h-4 w-4 text-ouro-400" />
              <input autoFocus value={termo} onChange={(e) => setTermo(e.target.value)} placeholder="O que você procura? Vestido, bolsa, conjunto..." className="w-full bg-transparent py-1 text-sm text-creme-100 outline-none placeholder:text-creme-100/40" />
              <button type="button" onClick={() => setBusca(false)} aria-label="Fechar busca"><X className="h-4 w-4" /></button>
            </div>
          </form>
        )}
      </header>

      {/* Menu mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menu ? '' : 'pointer-events-none'}`}>
        <div onClick={() => setMenu(false)} className={`absolute inset-0 bg-black/50 transition-opacity ${menu ? 'opacity-100' : 'opacity-0'}`} />
        <aside className={`absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-vinho-900 text-creme-100 transition-transform duration-500 ${menu ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between border-b border-ouro-500/20 px-5 py-5">
            <Wordmark compacto />
            <button onClick={() => setMenu(false)} aria-label="Fechar menu"><X className="h-5 w-5" /></button>
          </div>
          <ul className="flex-1 overflow-y-auto px-5 py-4">
            <li><Link href="/produtos" className="block border-b border-ouro-500/10 py-4 font-display tracking-[0.15em]">Ver tudo</Link></li>
            {links.map((l) => (
              <li key={l.href}><Link href={l.href} className={`block border-b border-ouro-500/10 py-4 font-display tracking-[0.15em] ${l.destaque ? 'text-ouro-400' : ''}`}>{l.label}</Link></li>
            ))}
          </ul>
          {config.instagram && (
            <a href={`https://instagram.com/${config.instagram}`} target="_blank" rel="noreferrer" className="m-5 flex items-center justify-center gap-2 border border-ouro-500/40 py-3 text-xs uppercase tracking-[0.2em] text-ouro-300">
              <Instagram className="h-4 w-4" /> @{config.instagram}
            </a>
          )}
        </aside>
      </div>
    </>
  );
}
