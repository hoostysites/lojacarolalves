'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Banner } from '@/lib/types';
import { Lotus } from './Lotus';

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);
  const n = banners.length;
  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6500);
    return () => clearInterval(t);
  }, [n]);
  if (!n) return null;

  return (
    <section className="relative h-[78vh] min-h-[520px] max-h-[860px] overflow-hidden bg-vinho-950">
      {banners.map((b, idx) => (
        <div key={b.id} className={`absolute inset-0 transition-opacity duration-[1200ms] ${idx === i ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
          {b.imagem_url ? (
            <>
              <picture>
                {b.imagem_mobile_url && <source media="(max-width: 767px)" srcSet={b.imagem_mobile_url} />}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.imagem_url} alt={b.titulo || ''} className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-out ${idx === i ? 'scale-105' : 'scale-100'}`} />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-r from-vinho-950/85 via-vinho-950/40 to-transparent" />
            </>
          ) : (
            <HeroArte />
          )}
          <div className="container-luxo relative flex h-full items-center">
            <div className={`max-w-xl ${idx === i ? 'animate-fadeUp' : ''}`}>
              <p className="eyebrow mb-5 text-ouro-400">Carol Alves · Moda &amp; Acessórios</p>
              {b.titulo && <h1 className="font-display text-5xl leading-[1.05] text-creme-100 md:text-7xl">{b.titulo}</h1>}
              <div className="my-7 h-px w-24 bg-gradient-to-r from-ouro-500 to-transparent" />
              {b.subtitulo && <p className="max-w-md font-serif text-xl italic leading-relaxed text-creme-100/85 md:text-2xl">{b.subtitulo}</p>}
              {b.cta_texto && b.cta_link && (
                <Link href={b.cta_link} className="btn-ouro mt-9">{b.cta_texto}</Link>
              )}
            </div>
          </div>
        </div>
      ))}
      {n > 1 && (
        <>
          <button onClick={() => setI((i - 1 + n) % n)} className="absolute left-4 top-1/2 hidden -translate-y-1/2 border border-ouro-500/40 p-3 text-ouro-300 transition hover:bg-ouro-500 hover:text-vinho-900 md:block" aria-label="Anterior"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => setI((i + 1) % n)} className="absolute right-4 top-1/2 hidden -translate-y-1/2 border border-ouro-500/40 p-3 text-ouro-300 transition hover:bg-ouro-500 hover:text-vinho-900 md:block" aria-label="Próximo"><ChevronRight className="h-4 w-4" /></button>
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
            {banners.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} aria-label={`Banner ${idx + 1}`}
                className={`h-[3px] transition-all duration-500 ${idx === i ? 'w-12 bg-ouro-400' : 'w-6 bg-creme-100/30'}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/** Arte de fundo usada quando o banner ainda não tem foto. */
function HeroArte() {
  return (
    <div className="grao absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,#7A3F4C_0%,#4F242F_35%,#1E0C10_80%)]">
      <div className="absolute right-[5%] top-1/2 hidden -translate-y-1/2 lg:block">
        <div className="relative flex h-[440px] w-[440px] xl:h-[500px] xl:w-[500px] items-center justify-center rounded-full border border-ouro-500/30">
          <div className="absolute inset-6 rounded-full border border-ouro-500/15" />
          <div className="absolute inset-12 overflow-hidden rounded-full shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]">
            <Image src="/logo-circle.png" alt="" fill className="object-cover" priority />
          </div>
        </div>
      </div>
      <Lotus className="absolute -left-20 bottom-[-60px] h-[340px] w-[420px] opacity-[0.06]" />
    </div>
  );
}
