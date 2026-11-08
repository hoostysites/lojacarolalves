/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

export function Wordmark({ compacto = false }: { compacto?: boolean }) {
  return (
    <Link href="/" aria-label="Carol Alves Moda & Acessórios, página inicial" className="block">
      <img src="/logo.svg" alt="Carol Alves Moda & Acessórios"
        className={`w-auto transition-all duration-500 hover:opacity-90 ${compacto ? 'h-10 md:h-11' : 'h-12 md:h-16'}`} />
    </Link>
  );
}
