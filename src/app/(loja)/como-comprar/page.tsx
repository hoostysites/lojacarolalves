import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Como comprar' };

const passos = [
  ['Escolha suas peças', 'Navegue pelas categorias, abra a peça que gostou e selecione tamanho e cor.'],
  ['Monte sua sacola', 'Adicione quantas peças quiser. A sacola fica salva no seu celular.'],
  ['Finalize pelo WhatsApp', 'Clique em "Finalizar pelo WhatsApp" e seu pedido chega para a gente já organizado.'],
  ['Pagamento e entrega', 'Confirmamos a disponibilidade e combinamos forma de pagamento, entrega ou retirada na loja.'],
];

export default function ComoComprar() {
  return (
    <section className="container-luxo max-w-3xl py-20 md:py-28">
      <p className="eyebrow text-center">Passo a passo</p>
      <h1 className="titulo-secao mt-3 text-center">Como comprar</h1>
      <div className="filete mx-auto my-8" />
      <ol className="space-y-10">
        {passos.map(([t, d], i) => (
          <li key={t} className="flex gap-6">
            <span className="texto-ouro font-display text-4xl">{String(i + 1).padStart(2, '0')}</span>
            <div><p className="font-display text-xl text-vinho-800">{t}</p><p className="mt-2 text-tinta/70">{d}</p></div>
          </li>
        ))}
      </ol>
      <div className="mt-14 text-center"><Link href="/produtos" className="btn-vinho">Começar a comprar</Link></div>
    </section>
  );
}
