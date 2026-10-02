import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCmsPageContent } from "./content-validation";

test("aceita conteúdo válido para Home", () => {
  assert.deepEqual(parseCmsPageContent("home", { galleryLabel: "Projetos em destaque" }), {
    galleryLabel: "Projetos em destaque",
  });
});

test("aceita conteúdo válido para Biografia", () => {
  const content = {
    publicName: "Taís",
    profileImage: "/perfil.jpg",
    introduction: "Introdução",
    biography: "Biografia",
    about: ["Sobre"],
  };
  assert.deepEqual(parseCmsPageContent("biography", content), content);
});

test("aceita conteúdo válido para Contato", () => {
  const content = {
    title: "Contato",
    subtitle: "Vamos conversar?",
    informationText: "Informações de contato.",
  };
  assert.deepEqual(parseCmsPageContent("contact", content), content);
});

test("aceita conteúdo válido Global", () => {
  const content = { publicName: "Taís", brandName: "TAÍS" };
  assert.deepEqual(parseCmsPageContent("global", content), content);
});

test("rejeita content null ou que não seja objeto", () => {
  assert.equal(parseCmsPageContent("home", null), null);
  assert.equal(parseCmsPageContent("home", "gallery"), null);
  assert.equal(parseCmsPageContent("home", 12), null);
  assert.equal(parseCmsPageContent("home", []), null);
});

test("rejeita formato válido para outro template", () => {
  assert.equal(
    parseCmsPageContent("home", {
      title: "Contato",
      subtitle: "Vamos conversar?",
      informationText: "Informações",
    }),
    null,
  );
});

test("rejeita o formato legado do Page Builder", () => {
  assert.equal(parseCmsPageContent("home", { sections: [] }), null);
});

test("rejeita campos obrigatórios ausentes e estruturas internas inválidas", () => {
  assert.equal(parseCmsPageContent("home", {}), null);
  assert.equal(
    parseCmsPageContent("biography", {
      publicName: "Taís",
      profileImage: "/perfil.jpg",
      introduction: "Introdução",
      biography: "Biografia",
    }),
    null,
  );
  assert.equal(
    parseCmsPageContent("biography", {
      publicName: "Taís",
      profileImage: "/perfil.jpg",
      introduction: "Introdução",
      biography: "Biografia",
      about: ["válido", 2],
    }),
    null,
  );
});

test("rejeita propriedades não definidas no contrato", () => {
  assert.equal(
    parseCmsPageContent("home", { galleryLabel: "Projetos", projects: [] }),
    null,
  );
});
