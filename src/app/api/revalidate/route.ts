import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

/** Atualiza a vitrine na hora depois de uma alteração no painel. Só admins. */
export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false },
  });
  const { data } = await sb.rpc('loja_is_admin');
  if (data !== true) return NextResponse.json({ ok: false }, { status: 403 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
