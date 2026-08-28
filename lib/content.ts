/**
 * Todo o texto do site vive aqui. Para editar qualquer título,
 * parágrafo, número ou legenda, mude o valor abaixo — não é
 * preciso mexer nos componentes.
 */

export const site = {
  nome: "Beeon",
  local: "Ribeirão Preto/SP · Passos/MG",
  cta: "Diagnóstico gratuito",
  ctaHref: "#diagnostico",
  headerCta: "Falar com um especialista",
  email: "contato@beeon.com.br",
  // TODO: substituir pelo número real de WhatsApp da Beeon antes de publicar.
  whatsappHref: "https://wa.me/5516999999999",
};

export const nav = [
  { label: "Início", href: "#top" },
  { label: "Sobre nós", href: "#agencia" },
  { label: "Cases", href: "/cases" },
  { label: "Serviços", href: "#servicos" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "#contato" },
];

export const hero = {
  headline: "Conectando marcas a pessoas.",
  video: "https://ik.imagekit.io/wk6ib5pvs/Site%20Beeon/Logo%20girando.mp4",
  proof: "Prêmio Limitless RD Station · +6 milhões de pessoas impactadas por mês",
  scrollLabel: "Role para conhecer",
};

export const premios = {
  eyebrow: "03 — Prêmios & Reconhecimento",
  titulo: "Reconhecimento de mercado e resultado que o cliente sente no dia a dia — não é relatório de vaidade, é receita.",
  destaque: {
    titulo: "Prêmio Limitless",
    desc: "RD Station reconheceu a Beeon entre as agências que mais entregam resultado real pra seus clientes.",
  },
  cards: [
    { valor: "+6M", desc: "pessoas impactadas por mês" },
    { valor: "+40", desc: "cidades atendidas" },
    { valor: "+1.000", desc: "anúncios por mês" },
  ],
};

export const diagnostico = {
  eyebrow: "08 — Diagnóstico gratuito",
  titulo: "Vamos achar onde seu marketing está perdendo receita.",
  subtitulo:
    "15 minutos de conversa, sem compromisso. Nossa equipe analisa seu cenário atual e te devolve um plano — não um pitch de venda.",
  confianca: ["Resposta em até 1 dia útil", "Sem letra miúda"],
};

export const servicos = [
  {
    slug: "inbound-marketing",
    nome: "Inbound Marketing",
    resumo: "Atrair, converter e nutrir leads até a venda.",
    casos: ["duda-imoveis", "atelie-materno", "pe-de-algodao", "kimika"],
    video: "https://ik.imagekit.io/wk6ib5pvs/Site%20Beeon/Inbound1.mp4",
  },
  {
    slug: "trafego-pago",
    nome: "Tráfego Pago",
    resumo: "Campanhas de anúncio orientadas a resultado, não a alcance.",
    casos: ["arapuca-festival"],
    video: "https://ik.imagekit.io/wk6ib5pvs/Site%20Beeon/trafego%20pago1.mp4",
  },
  {
    slug: "seo",
    nome: "SEO",
    resumo: "Tráfego orgânico qualificado, sem depender de mídia paga.",
    casos: [],
    video: "https://ik.imagekit.io/wk6ib5pvs/Site%20Beeon/seo1.mp4",
  },
  {
    slug: "performance",
    nome: "Performance",
    resumo: "Dados e otimização contínua guiando cada decisão de mídia.",
    casos: ["apalestra", "moto-oeste", "loja-plato"],
    video: "https://ik.imagekit.io/wk6ib5pvs/Site%20Beeon/performance2.mp4",
  },
] as const;

export const numeros = [
  { valor: 40, prefixo: "+", sufixo: "", label: "Cidades atendidas" },
  { valor: 6, prefixo: "+", sufixo: " Milhões", label: "Pessoas impactadas por mês" },
  { valor: 1000, prefixo: "+", sufixo: "", label: "Anúncios realizados por mês" },
] as const;

export const cases = [
  { cliente: "Duda Imóveis", servico: "Inbound Marketing", slug: "duda-imoveis" },
  { cliente: "Arapuca Festival", servico: "Anúncios Patrocinados", slug: "arapuca-festival" },
  {
    cliente: "Ateliê Materno",
    servico: "Inbound Marketing",
    slug: "atelie-materno",
    foto: "/cases/atelie-materno.png",
    resumo:
      "Marca especializada em brinquedos e móveis infantis de madeira, desenvolvidos para estimular a criatividade, a autonomia e o brincar livre. Criamos uma presença digital que valoriza a essência da marca e fortalece a conexão com famílias em todo o Brasil.",
  },
  {
    cliente: "Mariá Head & Hair",
    servico: "Inbound Marketing",
    slug: "maria-head-hair",
    foto: "/cases/maria-head-hair.png",
    resumo:
      "Referência em head spa no Brasil, a Mariá combina ciência, natureza e rituais exclusivos para promover saúde capilar e bem-estar. Nosso trabalho destacou a essência premium da marca em uma experiência digital elegante e envolvente.",
  },
  {
    cliente: "Expresso Nepomuceno",
    servico: "Inbound Marketing",
    slug: "expresso-nepomuceno",
    foto: "/cases/expresso-nepomuceno.png",
    resumo:
      "Há mais de 65 anos movimentando o Brasil com soluções logísticas inteligentes, a Expresso Nepomuceno é sinônimo de confiança, eficiência e inovação. Criamos uma comunicação digital que traduz a força e a tradição da marca.",
  },
  { cliente: "Pé de Algodão", servico: "Inbound Marketing", slug: "pe-de-algodao" },
  { cliente: "Sunew", servico: "Redes Sociais", slug: "sunew" },
  { cliente: "Kimika", servico: "Inbound Marketing", slug: "kimika" },
  { cliente: "Loja Platô", servico: "Inbound Marketing", slug: "loja-plato" },
  { cliente: "Apalestra", servico: "Performance", slug: "apalestra" },
  { cliente: "Moto Oeste", servico: "Inbound Marketing", slug: "moto-oeste" },
] as const;

export const metodo = {
  titulo: "05 — Como a Beeon trabalha",
  paragrafos: [
    "Cada estratégia nasce de um diagnóstico real — não de um modelo pronto aplicado a qualquer cliente. Entendemos o negócio, o mercado e o ponto onde a receita está travada antes de propor qualquer ação.",
    "Colocamos tráfego pago, inbound e SEO para trabalhar juntos, com metas de negócio acompanhadas semana a semana, não relatório de vaidade.",
    "O resultado é reportado em números que o cliente reconhece: lead qualificado, custo de aquisição, receita gerada.",
  ],
};

export const depoimentos = [
  {
    texto:
      "Estamos satisfeitíssimos com o trabalho que a Beeon tem realizado para a franquia. Sempre prestativos e criativos, vêm nos surpreendendo com os resultados na internet e com o reconhecimento e crescimento da nossa marca. Sempre os recomendo!",
    nome: "Geraldo Majela",
    cargo: "Diretor Presidente da DSG Farma",
  },
  {
    texto:
      "Comecei uma parceria com a Beeon e estou gostando bastante, pois o envolvimento com meus clientes vem aumentando cada dia mais e o retorno é garantido.",
    nome: "Vinícius Vilela",
    cargo: "Pimentas Fogo Mineiro",
  },
  {
    texto:
      "A Beeon nos ajudou a ter o reconhecimento de vários profissionais de todo o país. Recebemos diversos elogios em nossa página e, através dela, conseguimos divulgar e atingir muitos clientes e parceiros, sempre de maneira descontraída, rápida e com uma qualidade impecável.",
    nome: "Dr. Carlos Eduardo",
    cargo: "OMX Radiologia Odontológica",
  },
  {
    texto:
      "Estou com essa equipe maravilhosa há algum tempo e sem palavras para agradecer o profissionalismo, eficiência e clareza no trabalho, sempre respeitando nossa opinião e, o melhor, nos surpreendendo a cada dia!",
    nome: "Dra. Ariane Santos",
    cargo: "Dermatologista",
  },
] as const;

export const blog = [
  {
    categoria: "Marketing Digital",
    data: "14/08/2026",
    titulo: "Marketing contínuo: o conceito que a RD Station levou para o Mundo RD",
    resumo: "Como manter presença de marca ativa o ano inteiro, em vez de campanhas isoladas que somem depois do lançamento.",
    href: "#",
  },
  {
    categoria: "SEO",
    data: "09/07/2026",
    titulo: "Tráfego orgânico: como atrair visitantes sem pagar por anúncios",
    resumo: "As bases de uma estratégia de SEO que reduz a dependência de mídia paga e sustenta crescimento no médio prazo.",
    href: "#",
  },
  {
    categoria: "Marketing Digital",
    data: "08/07/2026",
    titulo: "Tráfego pago para empresas: a estratégia que acelera o crescimento do seu negócio",
    resumo: "Quando vale investir em anúncios, como estruturar campanhas e evitar o erro mais comum: pagar por alcance sem retorno.",
    href: "#",
  },
  {
    categoria: "SEO",
    data: "07/07/2026",
    titulo: "O poder do SEO para pequenas empresas: como destacar seu negócio na internet",
    resumo: "Um guia direto para negócios locais que querem aparecer no Google sem depender de agência grande ou orçamento alto.",
    href: "#",
  },
] as const;

export const footer = {
  sitemap: [
    { label: "A Agência", href: "#agencia" },
    { label: "Serviços", href: "#servicos" },
    { label: "Cases", href: "/cases" },
    { label: "Blog", href: "/blog" },
    { label: "Contato", href: "#contato" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Spotify", href: "https://spotify.com" },
  ],
  copyright: `© Beeon ${new Date().getFullYear()}`,
};
