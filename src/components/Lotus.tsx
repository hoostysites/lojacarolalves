/* eslint-disable @next/next/no-img-element */
/** Símbolo oficial da marca (flor de lótus), em nude #D3B293. */
export function Lotus({ className = '' }: { className?: string; stroke?: number }) {
  return <img src="/simbolo.svg" alt="" aria-hidden className={`object-contain ${className}`} />;
}

export function Monograma({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center px-6 ${className}`}>
      <img src="/logo.svg" alt="" aria-hidden className="w-[58%] max-w-[180px] opacity-80" />
    </div>
  );
}
