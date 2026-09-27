export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const servicesNav: NavItem[] = [
  { label: "Todos os serviços", href: "/servicos" },
  {
    label: "Sistemas Web",
    href: "/servicos/sistemas-web",
    description: "Painéis, portais, MVPs e ferramentas internas",
  },
  {
    label: "Automações de Processos",
    href: "/servicos/automacao",
    description: "Fluxos mais organizados e menos tarefas manuais",
  },
  {
    label: "Presença Digital",
    href: "/servicos/presenca-digital",
    description: "Sites, landing pages, blogs e SEO técnico",
  },
];

export const mainNav: NavItem[] = [
  { label: "Projetos", href: "/projetos" },
  { label: "Blog", href: "/blog" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export const footerNav = {
  servicos: servicesNav,
  empresa: [
    { label: "Início", href: "/" },
    { label: "Sobre", href: "/sobre" },
    { label: "Projetos", href: "/projetos" },
    { label: "Blog", href: "/blog" },
    { label: "Contato", href: "/contato" },
  ] as NavItem[],
  legal: [
    { label: "Política de Privacidade", href: "/politica-de-privacidade" },
    { label: "Termos de Uso", href: "/termos-de-uso" },
  ] as NavItem[],
};
