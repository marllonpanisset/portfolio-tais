const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "Portfolio Taís",
  description: "Portfólio profissional de Taís.",
  url: siteUrl,
  locale: "pt-BR",
  author: {
    name: "Taís",
    url: siteUrl,
  },
  // Temporary data used only by the inherited legal page, still under review.
  legacyLinks: {
    email: "contato@conjuga.com.br",
  },
} as const;
