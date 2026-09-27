/**
 * Centralizes immutable site information used across the application.
 *
 * Keeping SEO, metadata and structured data values in a single place avoids
 * duplication and ensures every page shares the same source of truth.
 */
const siteUrl = "https://www.conjuga.com.br";

export const siteConfig = {
  name: "Conjuga",

  legalName: "Conjuga",

  description:
    "Engenharia de software para empresas de serviços: sistemas web, automação, integrações e inteligência artificial aplicada.",

  url: siteUrl,

  locale: "pt-BR",

  openGraphImage: {
    path: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Conjuga — Engenharia de Software para empresas de serviços",
  },

  /**
   * Default keywords reused by the Metadata API.
   *
   * Individual pages may extend these keywords when appropriate.
   */
  keywords: [
    "sistemas web",
    "automações",
    "integrações",
    "inteligência artificial aplicada",
    "desenvolvimento web",
    "sites institucionais",
    "landing pages",
    "desenvolvimento sob medida",
    "Conjuga",
  ],

  /**
   * Author information is centralized so metadata remains consistent
   * across the entire application.
   */
  author: {
    name: "Conjuga",
    url: siteUrl,
  },

  /**
   * Structured social profiles used by SEO schemas.
   *
   * Search engines can associate these profiles with the organization
   * represented by this website.
   */
  sameAs: [
    "https://instagram.com/conjuga.br",
    "https://www.linkedin.com/company/conjuga-br",
  ],

  contact: {
    email: "contato@conjuga.com.br",
  },

  social: {
    linkedin: "https://www.linkedin.com/company/conjuga-br",

    instagram: "https://instagram.com/conjuga.br",
  },

  /**
   * Legacy link grouping kept temporarily to avoid breaking existing
   * components while the application migrates to semantic fields.
   */
  links: {
    email: "contato@conjuga.com.br",

    linkedin: "https://www.linkedin.com/company/conjuga-br",

    instagram: "https://instagram.com/conjuga.br",
  },
} as const;
