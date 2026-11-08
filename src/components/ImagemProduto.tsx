import { Lotus, Monograma } from './Lotus';

/** Mostra a foto do produto ou um placeholder elegante na identidade da marca. */
export function ImagemProduto({ src, alt, className = '', prioridade = false, mini = false }: {
  src?: string | null; alt: string; className?: string; prioridade?: boolean; mini?: boolean;
}) {
  if (!src) {
    return (
      <div className={`grao relative flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_30%_20%,#63303C_0%,#3F1C24_55%,#1E0C10_100%)] ${className}`}>
        {!mini && <div className="absolute inset-3 border border-ouro-500/25" />}
        {mini ? <Lotus className="h-6 w-8 text-ouro-400/80" /> : <Monograma />}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={prioridade ? 'eager' : 'lazy'} className={`h-full w-full object-cover ${className}`} />;
}
