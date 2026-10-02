import assert from "node:assert/strict";
import { test } from "node:test";
import { withHomeGalleryLabel } from "./home-content-update";

test("substitui somente galleryLabel no conteúdo Home válido", () => {
  assert.deepEqual(
    withHomeGalleryLabel({ galleryLabel: "Rótulo anterior" }, "Novo rótulo"),
    { galleryLabel: "Novo rótulo" },
  );
});

test("aceita rótulo vazio conforme o contrato string", () => {
  assert.deepEqual(
    withHomeGalleryLabel({ galleryLabel: "Rótulo anterior" }, ""),
    { galleryLabel: "" },
  );
});

test("rejeita conteúdo existente inválido ou do formato legado", () => {
  assert.equal(withHomeGalleryLabel(null, "Novo rótulo"), null);
  assert.equal(withHomeGalleryLabel({ sections: [] }, "Novo rótulo"), null);
});

test("rejeita novo rótulo que não seja string", () => {
  assert.equal(withHomeGalleryLabel({ galleryLabel: "Atual" }, null), null);
  assert.equal(withHomeGalleryLabel({ galleryLabel: "Atual" }, 42), null);
});
