'use client';
import { supabaseBrowser, BUCKET } from './supabase';

/** Pede para a vitrine se atualizar imediatamente. */
export async function revalidar() {
  try {
    const { data } = await supabaseBrowser().auth.getSession();
    const t = data.session?.access_token; if (!t) return;
    await fetch('/api/revalidate', { method: 'POST', headers: { Authorization: `Bearer ${t}` } });
  } catch {}
}

/** Reduz a imagem para no máximo `max` px e converte em WebP antes de subir. */
async function comprimir(file: File, max = 1600): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
  const bmp = await createImageBitmap(file);
  const escala = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * escala); c.height = Math.round(bmp.height * escala);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob((b) => res(b || file), 'image/webp', 0.86));
}

export async function uploadImagem(file: File, pasta: string, max = 1600): Promise<string> {
  const blob = await comprimir(file, max);
  const path = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const sb = supabaseBrowser();
  const { error } = await sb.storage.from(BUCKET).upload(path, blob, { contentType: 'image/webp', cacheControl: '31536000' });
  if (error) throw error;
  return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function apagarImagem(url: string) {
  const marca = `/object/public/${BUCKET}/`;
  const i = url.indexOf(marca); if (i < 0) return;
  await supabaseBrowser().storage.from(BUCKET).remove([url.slice(i + marca.length)]);
}
