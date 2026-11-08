import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getConfig } from '@/lib/data';
import { waLink } from '@/lib/format';

export const metadata: Metadata = { title: 'Sobre a loja' };
export const revalidate = 60;

export default async function Sobre() {
  const c = await getConfig();
  return (
    <section className="container-luxo grid items-center gap-14 py-20 md:grid-cols-2 md:py-28">
      <div className="relative mx-auto aspect-square w-full max-w-md">
        <div className="absolute inset-0 rounded-full border border-ouro-500/40" />
        <div className="absolute inset-8 overflow-hidden rounded-full shadow-2xl"><Image src="/logo-circle.png" alt="Carol Alves" fill className="object-cover" /></div>
      </div>
      <div>
        <p className="eyebrow">Sobre nós</p>
        <h1 className="titulo-secao mt-3">{c.nome}</h1>
        <div className="filete my-6 ml-0" />
        <p className="whitespace-pre-line font-serif text-xl leading-relaxed text-tinta/75">{c.sobre}</p>
        <dl className="mt-10 space-y-4 text-sm">
          {c.endereco && <div><dt className="label">Endereço</dt><dd>{c.endereco}</dd></div>}
          {c.horario && <div><dt className="label">Horário</dt><dd>{c.horario}</dd></div>}
        </dl>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/produtos" className="btn-vinho">Ver a loja</Link>
          {(c.whatsapp || '').replace(/\D/g, '') && <a href={waLink(c.whatsapp, 'Olá! Vim pelo site.')} target="_blank" rel="noreferrer" className="btn-linha">Falar no WhatsApp</a>}
        </div>
      </div>
    </section>
  );
}
