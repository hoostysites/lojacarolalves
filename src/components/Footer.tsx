import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, MessageCircle } from 'lucide-react';
import { Instagram } from './IconeInstagram';
import type { Categoria, Config } from '@/lib/types';
import { waLink } from '@/lib/format';

export function Footer({ config, categorias }: { config: Config; categorias: Categoria[] }) {
  const temWhats = !!(config.whatsapp || '').replace(/\D/g, '');
  return (
    <footer className="grao relative overflow-hidden bg-vinho-950 text-creme-100/80">
      <div className="h-px bg-gradient-to-r from-transparent via-ouro-500/60 to-transparent" />
      <div className="container-luxo grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Image src="/logo-circle.png" alt="Carol Alves Moda & Acessórios" width={120} height={120} className="rounded-full" />
          <p className="mt-6 max-w-xs font-serif text-lg italic leading-relaxed text-creme-100/70">
            Elegância em cada detalhe. Peças escolhidas a dedo para a mulher que brilha.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-5 text-ouro-400">Loja</p>
          <ul className="space-y-3 text-sm">
            <li><Link className="hover:text-ouro-300" href="/produtos">Ver tudo</Link></li>
            <li><Link className="hover:text-ouro-300" href="/produtos?filtro=novidades">Novidades</Link></li>
            <li><Link className="hover:text-ouro-300" href="/produtos?filtro=promocoes">Promoções</Link></li>
            {categorias.slice(0, 6).map((c) => <li key={c.id}><Link className="hover:text-ouro-300" href={`/categoria/${c.slug}`}>{c.nome}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5 text-ouro-400">Ajuda</p>
          <ul className="space-y-3 text-sm">
            <li><Link className="hover:text-ouro-300" href="/como-comprar">Como comprar</Link></li>
            <li><Link className="hover:text-ouro-300" href="/sobre">Sobre a loja</Link></li>
            {temWhats && <li><a className="hover:text-ouro-300" href={waLink(config.whatsapp, 'Olá! Vim pelo site.')} target="_blank" rel="noreferrer">Fale conosco</a></li>}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5 text-ouro-400">Visite a loja</p>
          <ul className="space-y-4 text-sm">
            {config.endereco && <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ouro-500" />{config.endereco}</li>}
            {config.horario && <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-ouro-500" />{config.horario}</li>}
            {temWhats && <li className="flex gap-3"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-ouro-500" /><a href={waLink(config.whatsapp, 'Olá! Vim pelo site.')} target="_blank" rel="noreferrer" className="hover:text-ouro-300">WhatsApp</a></li>}
            {config.instagram && <li className="flex gap-3"><Instagram className="mt-0.5 h-4 w-4 shrink-0 text-ouro-500" /><a href={`https://instagram.com/${config.instagram}`} target="_blank" rel="noreferrer" className="hover:text-ouro-300">@{config.instagram}</a></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-ouro-500/15">
        <div className="container-luxo flex flex-col items-center justify-between gap-2 py-6 text-[11px] uppercase tracking-[0.18em] text-creme-100/40 md:flex-row">
          <span>© {new Date().getFullYear()} Carol Alves Moda &amp; Acessórios</span>
          <span>Desenvolvido por Igor Pereira</span>
        </div>
      </div>
    </footer>
  );
}
