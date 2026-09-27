import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import path from "node:path";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],

  images: {
    formats: ["image/avif", "image/webp"],
  },

  typedRoutes: true,

  async redirects() {
    return [
      {
        source: "/servicos/landing-pages",
        destination: "/servicos/presenca-digital",
        permanent: true,
      },
      {
        source: "/servicos/sites-institucionais",
        destination: "/servicos/presenca-digital",
        permanent: true,
      },
      {
        source: "/servicos/automacoes-integracoes",
        destination: "/servicos/automacao",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      path.join(process.cwd(), "lib/remark-strip-frontmatter.mjs"),
    ],
  },
});

export default withMDX(nextConfig);
