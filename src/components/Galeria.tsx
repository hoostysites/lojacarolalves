'use client';
import { useState } from 'react';
import { ImagemProduto } from './ImagemProduto';

export function Galeria({ imagens, nome }: { imagens: string[]; nome: string }) {
  const lista = imagens?.length ? imagens : [null];
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {lista.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto md:w-20 md:flex-col">
          {lista.map((src, idx) => (
            <button key={idx} onClick={() => setI(idx)} className={`aspect-[3/4] w-16 shrink-0 overflow-hidden border transition md:w-full ${idx === i ? 'border-ouro-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <ImagemProduto src={src} alt={`${nome} ${idx + 1}`} mini />
            </button>
          ))}
        </div>
      )}
      <div
        className="relative aspect-[3/4] flex-1 overflow-hidden bg-creme-200"
        onMouseMove={(e) => { if (!lista[i]) return; const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
        onMouseLeave={() => setZoom(null)}
      >
        <div className="h-full w-full transition-transform duration-300" style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}>
          <ImagemProduto src={lista[i]} alt={nome} prioridade />
        </div>
      </div>
    </div>
  );
}
