import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Gem, MessageCircle, Sparkles, Store } from 'lucide-react';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProdutoCard } from '@/components/ProdutoCard';
import { ImagemProduto } from '@/components/ImagemProduto';
import { Reveal } from '@/components/Reveal';
import { Lotus } from '@/components/Lotus';
import { getBanners, getCategorias, getConfig, getProdutos } from '@/lib/data';

export const revalidate = 60;

export default async function Home() {
  const [banners, categorias, novidades, destaques, config] = await Promise.all([
    getBanners(), getCategorias(), getProdutos({ novidade: true, ordem: 'novos', limite: 8 }),
    getProdutos({ destaque: true, limite: 8 }), getConfig(),
  ]);

  return (
    <>
      <HeroCarousel banners={banners} />

      {/* Benefícios */}
      <section className="border-b border-creme-300 bg-creme-100">
        <div className="container-luxo grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4">
          {[
            { i: Gem, t: 'Curadoria exclusiva', s: 'Peças escolhidas a dedo' },
            { i: MessageCircle, t: 'Atendimento VIP', s: 'Direto pelo WhatsApp' },
            { i: Store, t: 'Retire na loja', s: 'Ou receba em casa' },
            { i: Sparkles, t: 'Novidades toda semana', s: 'Sempre algo novo' },
          ].map(({ i: I, t, s }) => (
            <div key={t} className="flex items-center justify-center gap-3 text-center md:text-left">
              <I className="h-6 w-6 shrink-0 text-ouro-600" strokeWidth={1.3} />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-vinho-800">{t}</p>
                <p className="text-xs text-tinta/55">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      {categorias.length > 0 && (
        <section className="container-luxo py-20 md:py-24">
          <Reveal className="mb-12 flex flex-col items-center text-center">
            <p className="eyebrow">Compre por categoria</p>
            <h2 className="titulo-secao mt-3">Encontre seu estilo</h2>
            <div className="filete mt-5" />
          </Reveal>
          <div className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-6">
            {categorias.map((c, idx) => (
              <Reveal key={c.id} delay={idx * 70} className="w-[42vw] shrink-0 snap-start md:w-auto">
                <Link href={`/categoria/${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-105">
                    <ImagemProduto src={c.imagem_url} alt={c.nome} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-vinho-950/85 via-vinho-950/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                    <p className="font-display text-base tracking-[0.12em] text-creme-100">{c.nome}</p>
                    <span className="mt-1 inline-block text-[10px] uppercase tracking-[0.25em] text-ouro-300 opacity-80 transition group-hover:opacity-100">Ver peças</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Novidades */}
      {novidades.length > 0 && (
        <section className="bg-creme-200/60 py-20 md:py-24">
          <div className="container-luxo">
            <Reveal className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Acabou de chegar</p>
                <h2 className="titulo-secao mt-3">Novidades</h2>
              </div>
              <Link href="/produtos?filtro=novidades" className="link-sub flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-vinho-700">Ver todas <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {novidades.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 80}><ProdutoCard p={p} prioridade={i < 4} /></Reveal>)}
            </div>
          </div>
        </section>
      )}

      {/* Manifesto */}
      <section className="grao relative overflow-hidden bg-vinho-900 py-24 text-creme-100 md:py-32">
        <Lotus className="absolute -right-24 -top-10 h-[420px] w-[520px] opacity-[0.05]" />
        <div className="container-luxo grid items-center gap-14 md:grid-cols-2">
          <Reveal className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full border border-ouro-500/30" />
            <div className="absolute inset-8 overflow-hidden rounded-full shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]">
              <Image src="/logo-circle.png" alt="Carol Alves" fill className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow text-ouro-400">Nossa essência</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">Elegância em <span className="texto-ouro animate-shimmer">cada detalhe</span></h2>
            <div className="my-7 h-px w-20 bg-gradient-to-r from-ouro-500 to-transparent" />
            <p className="font-serif text-xl leading-relaxed text-creme-100/80 md:text-2xl">{config.sobre}</p>
            <Link href="/sobre" className="btn-linha-ouro mt-10">Conheça a loja</Link>
          </Reveal>
        </div>
      </section>

      {/* Destaques */}
      {destaques.length > 0 && (
        <section className="container-luxo py-20 md:py-24">
          <Reveal className="mb-12 flex flex-col items-center text-center">
            <p className="eyebrow">Seleção da Carol</p>
            <h2 className="titulo-secao mt-3">Queridinhos da loja</h2>
            <div className="filete mt-5" />
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {destaques.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 80}><ProdutoCard p={p} /></Reveal>)}
          </div>
          <div className="mt-14 text-center"><Link href="/produtos" className="btn-vinho">Ver toda a loja</Link></div>
        </section>
      )}

      {/* Como comprar */}
      <section className="border-t border-creme-300 bg-creme-200/50 py-20">
        <div className="container-luxo">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow">Simples assim</p>
            <h2 className="titulo-secao mt-3">Como comprar</h2>
          </Reveal>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              ['01', 'Escolha suas peças', 'Navegue pelo catálogo, selecione tamanho e cor e adicione à sacola.'],
              ['02', 'Envie pelo WhatsApp', 'Com um clique, seu pedido chega para a gente já organizadinho.'],
              ['03', 'Receba ou retire', 'Combinamos pagamento, entrega ou retirada na loja com todo carinho.'],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 100} className="text-center">
                <p className="texto-ouro font-display text-5xl">{n}</p>
                <p className="mt-4 font-display text-lg tracking-[0.08em] text-vinho-800">{t}</p>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-tinta/65">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      {config.instagram && (
        <section className="relative overflow-hidden bg-vinho-950 py-16 text-center text-creme-100">
          <div className="container-luxo">
            <p className="eyebrow text-ouro-400">Siga a gente</p>
            <a href={`https://instagram.com/${config.instagram}`} target="_blank" rel="noreferrer" className="texto-ouro animate-shimmer mt-3 inline-block font-display text-3xl md:text-5xl">@{config.instagram}</a>
            <p className="mt-4 font-serif text-lg italic text-creme-100/70">Novidades, provadores e looks do dia, todo dia no nosso Instagram.</p>
          </div>
        </section>
      )}
    </>
  );
}
