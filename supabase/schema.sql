-- Loja Carol Alves: estrutura do banco (já aplicada no projeto PLATAFORMA).
-- Para migrar para um projeto dedicado, rode este arquivo no SQL Editor do novo projeto
-- e troque NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel.

create table if not exists public.loja_config (
  id int primary key default 1 check (id = 1),
  nome text not null default 'Carol Alves', slogan text default 'Moda & Acessórios',
  whatsapp text default '', instagram text default 'lojacarolalves',
  endereco text default 'Cidade Nova, Feira de Santana - BA',
  horario text default 'Seg a Sex 9h às 18h | Sáb 9h às 14h',
  aviso_topo text default 'Atendimento personalizado pelo WhatsApp | Retire na loja ou receba em casa',
  sobre text, updated_at timestamptz default now()
);
insert into public.loja_config (id) values (1) on conflict do nothing;
create table if not exists public.loja_admins (email text primary key, created_at timestamptz default now());
create table if not exists public.loja_categorias (
  id uuid primary key default gen_random_uuid(), nome text not null, slug text not null unique,
  descricao text, imagem_url text, ordem int default 0, ativo boolean default true, created_at timestamptz default now()
);
create table if not exists public.loja_produtos (
  id uuid primary key default gen_random_uuid(), nome text not null, slug text not null unique, descricao text,
  preco numeric(10,2) not null default 0, preco_promocional numeric(10,2),
  categoria_id uuid references public.loja_categorias(id) on delete set null,
  tamanhos text[] default '{}', cores jsonb default '[]'::jsonb, imagens text[] default '{}',
  destaque boolean default false, novidade boolean default true,
  status text default 'disponivel' check (status in ('disponivel','ultimas','esgotado')),
  ativo boolean default true, ordem int default 0, created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists loja_produtos_categoria_idx on public.loja_produtos(categoria_id);
create index if not exists loja_produtos_ativo_idx on public.loja_produtos(ativo, created_at desc);
create table if not exists public.loja_banners (
  id uuid primary key default gen_random_uuid(), titulo text, subtitulo text, cta_texto text default 'Ver coleção',
  cta_link text default '/produtos', imagem_url text, imagem_mobile_url text, ordem int default 0,
  ativo boolean default true, created_at timestamptz default now()
);
create table if not exists public.loja_pedidos (
  id uuid primary key default gen_random_uuid(), cliente_nome text, cliente_telefone text,
  itens jsonb not null default '[]'::jsonb, total numeric(10,2) default 0, observacao text,
  status text default 'novo' check (status in ('novo','em_atendimento','concluido','cancelado')),
  created_at timestamptz default now()
);
create or replace function public.loja_is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.loja_admins where lower(email) = lower(coalesce(auth.jwt()->>'email','')));
$$;
alter table public.loja_config enable row level security; alter table public.loja_admins enable row level security;
alter table public.loja_categorias enable row level security; alter table public.loja_produtos enable row level security;
alter table public.loja_banners enable row level security; alter table public.loja_pedidos enable row level security;
create policy loja_config_read on public.loja_config for select using (true);
create policy loja_config_admin on public.loja_config for update to authenticated using (public.loja_is_admin()) with check (public.loja_is_admin());
create policy loja_admins_self on public.loja_admins for select to authenticated using (lower(email) = lower(auth.jwt()->>'email'));
create policy loja_cat_read on public.loja_categorias for select using (ativo or public.loja_is_admin());
create policy loja_cat_admin on public.loja_categorias for all to authenticated using (public.loja_is_admin()) with check (public.loja_is_admin());
create policy loja_prod_read on public.loja_produtos for select using (ativo or public.loja_is_admin());
create policy loja_prod_admin on public.loja_produtos for all to authenticated using (public.loja_is_admin()) with check (public.loja_is_admin());
create policy loja_ban_read on public.loja_banners for select using (ativo or public.loja_is_admin());
create policy loja_ban_admin on public.loja_banners for all to authenticated using (public.loja_is_admin()) with check (public.loja_is_admin());
create policy loja_ped_insert on public.loja_pedidos for insert to anon, authenticated with check (status = 'novo' and jsonb_typeof(itens) = 'array');
create policy loja_ped_admin_read on public.loja_pedidos for select to authenticated using (public.loja_is_admin());
create policy loja_ped_admin_upd on public.loja_pedidos for update to authenticated using (public.loja_is_admin()) with check (public.loja_is_admin());
create policy loja_ped_admin_del on public.loja_pedidos for delete to authenticated using (public.loja_is_admin());
insert into storage.buckets (id, name, public) values ('loja-carol', 'loja-carol', true) on conflict (id) do nothing;
create policy loja_storage_admin_ins on storage.objects for insert to authenticated with check (bucket_id = 'loja-carol' and public.loja_is_admin());
create policy loja_storage_admin_upd on storage.objects for update to authenticated using (bucket_id = 'loja-carol' and public.loja_is_admin());
create policy loja_storage_admin_del on storage.objects for delete to authenticated using (bucket_id = 'loja-carol' and public.loja_is_admin());
-- Liberar acesso ao painel:
-- insert into public.loja_admins (email) values ('email@dacarol.com');
