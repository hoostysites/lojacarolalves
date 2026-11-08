# Loja Carol Alves (catálogo)

Next.js 14 (App Router) + Tailwind + Supabase. Identidade oficial: bordô #4F242F e nude #D3B293, logo vetorial em `public/logo.svg`. Vitrine com sacola que finaliza o pedido pelo WhatsApp e painel administrativo em `/admin`.

## Subir na Vercel
1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel: **Add New > Project**, importe o repositório (framework detectado: Next.js).
3. Em **Environment Variables**, cadastre:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://cwzzqnlenzhwvkqopygd.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_DTvm22wVDDc_00mPgv-AGA_dA5OyUiw`
   - `NEXT_PUBLIC_SITE_URL` = domínio final (ex: `https://lojacarolalves.com.br`)
4. Deploy.

## Supabase (Authentication > URL Configuration)
Adicione o domínio da Vercel em **Site URL / Redirect URLs** (ex: `https://lojacarolalves.vercel.app/admin`) para o "primeiro acesso" e o "esqueci a senha" funcionarem.

## Painel
- Acesse `/admin`, clique em **Primeiro acesso** e crie a senha com um e-mail liberado.
- E-mails liberados ficam na tabela `loja_admins` (já tem `igorpereirapontes@gmail.com`). Para liberar a Carol:
  `insert into loja_admins (email) values ('email-da-carol@...');`
- Em **Configurações**, cadastre o WhatsApp da loja (sem ele o botão de finalizar fica desativado).
- Os 12 produtos marcados "(produto de exemplo)" podem ser editados com as fotos reais ou excluídos.

## Funcionalidades
- Vitrine: banners em carrossel, categorias, novidades, destaques, busca, ordenação, página de produto com galeria e zoom, tamanhos, cores, selos (novo, % off, últimas peças, esgotado), produtos relacionados.
- Sacola salva no navegador; finaliza mandando o pedido formatado para o WhatsApp e registra em `loja_pedidos`.
- Painel: produtos (fotos com compressão automática para WebP, duplicar, ativar/destacar), categorias, banners (desktop e celular), pedidos com status, configurações da loja. Alterações aparecem na loja na hora.
- SEO: metadados, Open Graph, sitemap, robots, JSON-LD de produto, PWA manifest.

## Rodar local
```
npm install
npm run dev
```
