const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "Taís",
  title: "Portfólio de Taís",
  description: "Portfólio, biografia e contato de Taís.",
  url: siteUrl,
  locale: "pt-BR",
  author: {
    name: "Taís",
    url: siteUrl,
  },
} as const;
