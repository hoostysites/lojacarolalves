import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="container-luxo py-32 text-center">
      <p className="eyebrow">Erro 404</p>
      <h1 className="titulo-secao mt-3">Página não encontrada</h1>
      <p className="mt-4 font-serif text-xl italic text-tinta/60">Essa peça pode ter saído do catálogo.</p>
      <Link href="/produtos" className="btn-vinho mt-10">Ver a loja</Link>
    </section>
  );
}
