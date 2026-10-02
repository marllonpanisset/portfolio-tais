import assert from "node:assert/strict";
import test from "node:test";
import { mapProjectMediaToHomeGallery } from "./home-media.ts";

test("maps an image and preserves its text alternatives and order", () => {
  const result = mapProjectMediaToHomeGallery([
    {
      id: "image-1",
      kind: "image",
      source: "upload",
      src: "https://media.example/image.jpg",
      alt: "Portfolio image",
      caption: "Image caption",
      order: 2,
    },
  ]);

  assert.deepEqual(result, [{
    id: "image-1",
    kind: "image",
    src: "https://media.example/image.jpg",
    alt: "Portfolio image",
    caption: "Image caption",
    order: 2,
  }]);
});

test("maps YouTube media using its existing URL", () => {
  const result = mapProjectMediaToHomeGallery([
    {
      id: "youtube-1",
      kind: "video",
      source: "youtube",
      src: "https://youtu.be/abcdefghijk",
      alt: null,
      caption: null,
      order: 1,
    },
  ]);

  assert.deepEqual(result, [{
    id: "youtube-1",
    kind: "youtube",
    src: "https://youtu.be/abcdefghijk",
    order: 1,
  }]);
});

test("keeps multiple image and YouTube media in sort_order", () => {
  const result = mapProjectMediaToHomeGallery([
    {
      id: "image-later",
      kind: "image",
      source: "upload",
      src: "/later.jpg",
      alt: null,
      caption: null,
      order: 3,
    },
    {
      id: "youtube-first",
      kind: "video",
      source: "youtube",
      src: "https://youtu.be/abcdefghijk",
      alt: null,
      caption: null,
      order: 1,
    },
    {
      id: "image-middle",
      kind: "image",
      source: "upload",
      src: "/middle.jpg",
      alt: null,
      caption: null,
      order: 2,
    },
  ]);

  assert.deepEqual(result.map((item) => item.id), [
    "youtube-first",
    "image-middle",
    "image-later",
  ]);
});

test("returns an empty list for a project without media", () => {
  assert.deepEqual(mapProjectMediaToHomeGallery([]), []);
});

test("preserves a project that has only YouTube media", () => {
  const result = mapProjectMediaToHomeGallery([
    {
      id: "youtube-only",
      kind: "video",
      source: "youtube",
      src: "https://www.youtube.com/watch?v=abcdefghijk",
      alt: null,
      caption: null,
      order: 0,
    },
  ]);

  assert.equal(result.length, 1);
  assert.equal(result[0]?.kind, "youtube");
  assert.equal(result[0]?.src, "https://www.youtube.com/watch?v=abcdefghijk");
});
