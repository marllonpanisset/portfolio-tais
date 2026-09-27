export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const mainNav: NavItem[] = [
  { label: "HOME", href: "/" },
  { label: "BIOGRAFIA", href: "/biografia" },
  { label: "PORTFÓLIO", href: "/portfolio" },
  { label: "CONTATO", href: "/contato" },
];
