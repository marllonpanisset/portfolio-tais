import assert from "node:assert/strict";
import test from "node:test";
import {
  mapProjectsToHomeContent,
  normalizeHomeContent,
  resolveHomeContent,
  type HomeContent,
} from "./home-content";

const projects = [
  {
    id: "later",
    title: "Later",
    slug: "later",
    description: "Second project",
    categoryId: "cat",
    order: 2,
    media: [
      { id: "video", kind: "youtube" as const, src: "https://youtu.be/abcdefghijk", order: 2 },
      { id: "cover", kind: "image" as const, src: "/cover.jpg", alt: "Cover", caption: "A cover", order: 1 },
    ],
  },
  {
    id: "first",
    title: "First",
    slug: "first",
    description: "First project",
    categoryId: "missing",
    year: 2025,
    order: 1,
    media: [],
  },
];

const categories = [{ id: "cat", name: "Category" }];

test("maps projects to valid Home content with ordered items and media", () => {
  const result = mapProjectsToHomeContent(projects, categories, "Gallery");
  assert.equal(result.gallery.label, "Gallery");
  assert.deepEqual(result.gallery.items.map((item) => item.id), ["first", "later"]);
  assert.deepEqual(result.gallery.items[1]?.media.map((item) => item.id), ["cover", "video"]);
  assert.equal(result.gallery.items[1]?.media[0]?.kind, "image");
  assert.equal(result.gallery.items[1]?.media[1]?.kind, "video");
  assert.equal(result.gallery.items[1]?.media[0]?.alt, "Cover");
  assert.equal(result.gallery.items[1]?.media[0]?.caption, "A cover");
  assert.equal(result.gallery.items[1]?.category, "Category");
  assert.equal(result.gallery.items[1]?.slug, "later");
});

test("preserves optional values only when present", () => {
  const result = mapProjectsToHomeContent(projects, categories);
  const first = result.gallery.items.find((item) => item.id === "later");
  const second = result.gallery.items.find((item) => item.id === "first");
  assert.ok(first);
  assert.ok(second);
  assert.equal("year" in first, false);
  assert.equal("category" in second, false);
  assert.equal(second.year, 2025);
});

test("normalizes incoming Home content and filters invalid media safely", () => {
  const result = normalizeHomeContent({
    gallery: {
      label: "CMS Gallery",
      items: [{
        id: "item", title: "Title", slug: "title", description: "Text", order: 1,
        media: [
          { id: "later", kind: "youtube", src: "https://youtu.be/abcdefghijk", order: 2 },
          { id: "invalid", kind: "audio", src: "/a", order: 0 },
          { id: "first", kind: "image", src: "/i.jpg", order: 1 },
        ],
      }],
    },
  });
  assert.ok(result);
  assert.deepEqual(result.gallery.items[0]?.media.map((item) => item.id), ["first", "later"]);
  assert.equal(normalizeHomeContent({ sections: [] }), null);
});

test("uses static content fallback for invalid CMS payload", () => {
  const fallback: HomeContent = mapProjectsToHomeContent(projects, categories);
  assert.equal(resolveHomeContent(null, fallback), fallback);
  assert.equal(resolveHomeContent({ gallery: { label: "CMS", items: [] } }, fallback).gallery.label, "CMS");
});
