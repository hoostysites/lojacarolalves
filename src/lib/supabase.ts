import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Cliente público, sem sessão. Usado nas páginas da vitrine (server components). */
export const supabasePublic = () =>
  createClient(url, key, { auth: { persistSession: false } });

let browser: SupabaseClient | null = null;
/** Cliente do navegador com sessão. Usado no painel e na sacola. */
export const supabaseBrowser = (): SupabaseClient => (browser ??= createBrowserClient(url, key) as unknown as SupabaseClient);

export const BUCKET = 'loja-carol';
