import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogPostMeta } from "@/types/blog-post";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostMetaBySlug(slug: string): BlogPostMeta {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    segment: data.segment,
    readingTime: stats.text,
  };
}

export function getAllPostsMeta(): BlogPostMeta[] {
  return getAllPostSlugs()
    .map(getPostMetaBySlug)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
