export type Cor = { nome: string; hex: string };
export type Categoria = {
  id: string; nome: string; slug: string; descricao: string | null;
  imagem_url: string | null; ordem: number; ativo: boolean;
};
export type Produto = {
  id: string; nome: string; slug: string; descricao: string | null;
  preco: number; preco_promocional: number | null; categoria_id: string | null;
  tamanhos: string[]; cores: Cor[]; imagens: string[];
  destaque: boolean; novidade: boolean; status: 'disponivel' | 'ultimas' | 'esgotado';
  ativo: boolean; ordem: number; created_at: string;
  categoria?: Pick<Categoria, 'nome' | 'slug'> | null;
};
export type Banner = {
  id: string; titulo: string | null; subtitulo: string | null; cta_texto: string | null;
  cta_link: string | null; imagem_url: string | null; imagem_mobile_url: string | null;
  ordem: number; ativo: boolean;
};
export type Config = {
  nome: string; slogan: string | null; whatsapp: string | null; instagram: string | null;
  endereco: string | null; horario: string | null; aviso_topo: string | null; sobre: string | null;
};
export type Pedido = {
  id: string; cliente_nome: string | null; cliente_telefone: string | null;
  itens: ItemSacola[]; total: number; observacao: string | null;
  status: 'novo' | 'em_atendimento' | 'concluido' | 'cancelado'; created_at: string;
};
export type ItemSacola = {
  key: string; produtoId: string; slug: string; nome: string; imagem: string | null;
  preco: number; tamanho: string | null; cor: string | null; qtd: number;
};
