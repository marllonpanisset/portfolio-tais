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
        source: "/sobre",
        destination: "/biografia",
        permanent: true,
      },
      {
        source: "/projetos",
        destination: "/portfolio",
        permanent: true,
      },
      {
        source: "/projetos/:slug",
        destination: "/trabalhos/:slug",
        permanent: true,
      },
      {
        source: "/servicos/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/solucoes/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/:path*",
        destination: "/",
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
