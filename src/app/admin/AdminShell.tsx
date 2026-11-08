'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ExternalLink, Image as ImageIcon, LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingBag, Tags, X } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';

const nav = [
  { href: '/admin', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/categorias', label: 'Categorias', icon: Tags },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/admin/config', label: 'Configurações', icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const sb = supabaseBrowser();
  const [session, setSession] = useState<Session | null>(null);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [recuperando, setRecuperando] = useState(false);
  const [menu, setMenu] = useState(false);
  const path = usePathname();

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setCarregando(false); });
    const { data: sub } = sb.auth.onAuthStateChange((ev, s) => {
      if (ev === 'PASSWORD_RECOVERY') setRecuperando(true);
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  useEffect(() => {
    if (!session) { setAdmin(null); return; }
    sb.rpc('loja_is_admin').then(({ data }) => setAdmin(data === true));
  }, [session, sb]);
  useEffect(() => setMenu(false), [path]);

  if (carregando || (session && admin === null)) {
    return <Tela><p className="animate-pulse text-sm text-creme-100/60">Carregando painel...</p></Tela>;
  }
  if (recuperando && session) return <Tela><NovaSenha onFeito={() => setRecuperando(false)} /></Tela>;
  if (!session) return <Tela><Login /></Tela>;
  if (!admin) {
    return (
      <Tela>
        <div className="space-y-4 text-center">
          <p className="font-display text-xl text-ouro-300">Acesso não autorizado</p>
          <p className="text-sm text-creme-100/70">O e-mail {session.user.email} não está liberado para este painel.</p>
          <button onClick={() => sb.auth.signOut()} className="btn-linha-ouro">Sair</button>
        </div>
      </Tela>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] lg:grid lg:grid-cols-[250px_1fr]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-[250px] bg-vinho-950 text-creme-100 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${menu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 border-b border-ouro-500/15 px-6 py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Carol Alves" className="h-10 w-auto" />
          <p className="text-[9px] uppercase leading-tight tracking-[0.25em] text-creme-100/50">Painel<br />da loja</p>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map(({ href, label, icon: I }) => {
            const ativo = href === '/admin' ? path === href : path.startsWith(href);
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-3 text-sm transition ${ativo ? 'bg-ouro-500/15 text-ouro-300' : 'text-creme-100/70 hover:bg-white/5 hover:text-creme-100'}`}>
                <I className="h-4 w-4" />{label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 space-y-1 border-t border-ouro-500/15 p-3">
          <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-sm text-creme-100/70 hover:text-ouro-300"><ExternalLink className="h-4 w-4" />Ver loja</a>
          <button onClick={() => sb.auth.signOut()} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-creme-100/70 hover:text-ouro-300"><LogOut className="h-4 w-4" />Sair</button>
        </div>
      </aside>
      {menu && <div onClick={() => setMenu(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-creme-300 bg-white/90 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setMenu(true)} aria-label="Menu"><Menu className="h-5 w-5" /></button>
          <p className="font-display tracking-[0.15em] text-vinho-800">Painel</p>
          <span className="w-5" />
        </header>
        <main className="mx-auto max-w-6xl p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function Tela({ children }: { children: React.ReactNode }) {
  return (
    <div className="grao relative flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_50%_20%,#63303C_0%,#2E1419_60%,#1E0C10_100%)] p-5 text-creme-100">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Carol Alves" className="h-20 w-auto" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-creme-100/50">Painel da loja</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function Login() {
  const sb = supabaseBrowser();
  const [modo, setModo] = useState<'entrar' | 'criar' | 'esqueci'>('entrar');
  const [email, setEmail] = useState(''); const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState(''); const [load, setLoad] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault(); setLoad(true); setMsg('');
    if (modo === 'entrar') {
      const { error } = await sb.auth.signInWithPassword({ email, password: senha });
      if (error) setMsg('E-mail ou senha incorretos.');
    } else if (modo === 'criar') {
      const { data, error } = await sb.auth.signUp({ email, password: senha, options: { emailRedirectTo: `${location.origin}/admin` } });
      if (error) setMsg(error.message.includes('registered') ? 'Esse e-mail já tem acesso. Use "Entrar".' : 'Não foi possível criar o acesso.');
      else if (!data.session) setMsg('Enviamos um e-mail de confirmação. Confirme e depois entre.');
    } else {
      await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin` });
      setMsg('Se o e-mail estiver cadastrado, você vai receber um link para criar nova senha.');
    }
    setLoad(false);
  };

  return (
    <form onSubmit={enviar} className="space-y-4 border border-ouro-500/25 bg-vinho-950/50 p-7 backdrop-blur">
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="w-full border border-ouro-500/25 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-creme-100/40 focus:border-ouro-400" />
      {modo !== 'esqueci' && <input type="password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" className="w-full border border-ouro-500/25 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-creme-100/40 focus:border-ouro-400" />}
      <button disabled={load} className="btn-ouro w-full">{load ? 'Aguarde...' : modo === 'entrar' ? 'Entrar' : modo === 'criar' ? 'Criar acesso' : 'Enviar link'}</button>
      {msg && <p className="text-center text-xs text-ouro-300">{msg}</p>}
      <div className="flex justify-between pt-1 text-[11px] text-creme-100/60">
        {modo !== 'entrar' ? <button type="button" onClick={() => setModo('entrar')} className="hover:text-ouro-300">Voltar para entrar</button>
          : <button type="button" onClick={() => setModo('criar')} className="hover:text-ouro-300">Primeiro acesso</button>}
        {modo === 'entrar' && <button type="button" onClick={() => setModo('esqueci')} className="hover:text-ouro-300">Esqueci a senha</button>}
      </div>
    </form>
  );
}

function NovaSenha({ onFeito }: { onFeito: () => void }) {
  const [senha, setSenha] = useState(''); const [msg, setMsg] = useState('');
  return (
    <form onSubmit={async (e) => { e.preventDefault(); const { error } = await supabaseBrowser().auth.updateUser({ password: senha }); if (error) setMsg('Não foi possível salvar.'); else onFeito(); }}
      className="space-y-4 border border-ouro-500/25 bg-vinho-950/50 p-7">
      <p className="text-center text-sm">Crie sua nova senha</p>
      <input type="password" minLength={6} required value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Nova senha" className="w-full border border-ouro-500/25 bg-transparent px-4 py-3 text-sm outline-none focus:border-ouro-400" />
      <button className="btn-ouro w-full">Salvar senha</button>
      {msg && <p className="text-center text-xs text-ouro-300">{msg}</p>}
    </form>
  );
}
