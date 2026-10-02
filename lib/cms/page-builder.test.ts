/**
 * Page Builder Helpers Tests (CMS 08.2)
 *
 * Testes funcionais para os helpers do Page Builder.
 * Sem runner adicional: compile page-builder.ts e este arquivo com `npx tsc`
 * para um diretório temporário e execute o JS gerado com `node`. O próprio
 * node:test registra e executa todos os casos ao carregar o arquivo.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  type PageBuilderContent,
  type PageBuilderBlockType,
  createBlock,
  createColumn,
  createSection,
  normalizeContent,
  isPageBuilderContent,
  isValidColumnWidth,
  addSection,
  removeSection,
  setSectionColumnCount,
  addColumnToSection,
  removeColumnFromSection,
  addBlockToColumn,
  removeBlockFromColumn,
  COLUMN_WIDTHS,
  BLOCK_TYPE_LABELS,
} from "./page-builder";

// ============================================================================
// normalizeContent
// ============================================================================

test("normalizeContent: conteúdo vazio normaliza para sections[]", () => {
  const result = normalizeContent(null);
  assert.deepEqual(result, { sections: [] });
});

test("normalizeContent: objeto vazio normaliza para sections[]", () => {
  const result = normalizeContent({});
  assert.deepEqual(result, { sections: [] });
});

test("normalizeContent: string normaliza para sections[]", () => {
  const result = normalizeContent("invalid");
  assert.deepEqual(result, { sections: [] });
});

test("normalizeContent: array normaliza para sections[]", () => {
  const result = normalizeContent([]);
  assert.deepEqual(result, { sections: [] });
});

test("normalizeContent: aceita formato {\"sections\":[]}", () => {
  const result = normalizeContent({ sections: [] });
  assert.deepEqual(result, { sections: [] });
});

test("normalizeContent: preserva seções válidas", () => {
  const raw = {
    sections: [
      {
        id: "s1",
        columns: [
          {
            id: "c1",
            width: 100,
            blocks: [{ id: "b1", type: "heading" }],
          },
        ],
      },
    ],
  };
  const result = normalizeContent(raw);
  assert.equal(result.sections.length, 1);
  assert.equal(result.sections[0]!.id, "s1");
  assert.equal(result.sections[0]!.columns.length, 1);
  assert.equal(result.sections[0]!.columns[0]!.id, "c1");
  assert.equal(result.sections[0]!.columns[0]!.blocks.length, 1);
  assert.equal(result.sections[0]!.columns[0]!.blocks[0]!.id, "b1");
  assert.equal(result.sections[0]!.columns[0]!.blocks[0]!.type, "heading");
});

test("normalizeContent: ignora blocos com tipo inválido", () => {
  const raw = {
    sections: [
      {
        id: "s1",
        columns: [
          {
            id: "c1",
            width: 100,
            blocks: [
              { id: "b1", type: "heading" },
              { id: "b2", type: "invalid-type" },
            ],
          },
        ],
      },
    ],
  };
  const result = normalizeContent(raw);
  assert.equal(result.sections[0]!.columns[0]!.blocks.length, 1);
  assert.equal(result.sections[0]!.columns[0]!.blocks[0]!.type, "heading");
});

test("normalizeContent: gera IDs para blocos sem ID", () => {
  const raw = {
    sections: [
      {
        id: "s1",
        columns: [
          {
            id: "c1",
            width: 100,
            blocks: [{ type: "paragraph" }],
          },
        ],
      },
    ],
  };
  const result = normalizeContent(raw);
  assert.equal(result.sections[0]!.columns[0]!.blocks.length, 1);
  assert.ok(result.sections[0]!.columns[0]!.blocks[0]!.id.length > 0);
});

// ============================================================================
// createBlock
// ============================================================================

test("createBlock: cria bloco com tipo válido", () => {
  const block = createBlock("heading");
  assert.ok(block.id.length > 0);
  assert.equal(block.type, "heading");
});

test("createBlock: gera IDs únicos", () => {
  const block1 = createBlock("heading");
  const block2 = createBlock("heading");
  assert.notEqual(block1.id, block2.id);
});

test("createBlock: suporta todos os tipos", () => {
  const types: PageBuilderBlockType[] = [
    "heading",
    "paragraph",
    "image",
    "gallery",
    "youtube",
    "button",
  ];
  for (const type of types) {
    const block = createBlock(type);
    assert.equal(block.type, type);
  }
});

// ============================================================================
// createColumn
// ============================================================================

test("createColumn: cria coluna vazia com largura padrão", () => {
  const column = createColumn();
  assert.ok(column.id.length > 0);
  assert.equal(column.width, 100);
  assert.deepEqual(column.blocks, []);
});

test("createColumn: aceita largura personalizada", () => {
  const column = createColumn(50);
  assert.equal(column.width, 50);
});

test("createColumn: largura inválida usa o valor padrão seguro", () => {
  assert.equal(createColumn(75).width, 100);
  assert.equal(isValidColumnWidth(50), true);
  assert.equal(isValidColumnWidth(75), false);
});

test("createColumn: gera IDs únicos", () => {
  const col1 = createColumn();
  const col2 = createColumn();
  assert.notEqual(col1.id, col2.id);
});

// ============================================================================
// createSection
// ============================================================================

test("createSection: cria seção com uma coluna vazia", () => {
  const section = createSection();
  assert.ok(section.id.length > 0);
  assert.equal(section.columns.length, 1);
  assert.equal(section.columns[0]!.width, 100);
  assert.deepEqual(section.columns[0]!.blocks, []);
});

test("createSection: gera IDs únicos", () => {
  const s1 = createSection();
  const s2 = createSection();
  assert.notEqual(s1.id, s2.id);
});

// ============================================================================
// isPageBuilderContent
// ============================================================================

test("isPageBuilderContent: retorna true para conteúdo válido", () => {
  const content: PageBuilderContent = { sections: [] };
  assert.equal(isPageBuilderContent(content), true);
});

test("isPageBuilderContent: retorna false para null", () => {
  assert.equal(isPageBuilderContent(null), false);
});

test("isPageBuilderContent: retorna false para objeto sem sections", () => {
  assert.equal(isPageBuilderContent({}), false);
});

test("isPageBuilderContent: retorna false para array", () => {
  assert.equal(isPageBuilderContent([]), false);
});

// ============================================================================
// COLUMN_WIDTHS
// ============================================================================

test("COLUMN_WIDTHS: 1 coluna = 100%", () => {
  assert.deepEqual([...COLUMN_WIDTHS[1]], [100]);
});

test("COLUMN_WIDTHS: 2 colunas = 50/50", () => {
  assert.deepEqual([...COLUMN_WIDTHS[2]], [50, 50]);
});

test("COLUMN_WIDTHS: 3 colunas = 33/34/33", () => {
  assert.deepEqual([...COLUMN_WIDTHS[3]], [33, 34, 33]);
});

// ============================================================================
// BLOCK_TYPE_LABELS
// ============================================================================

test("BLOCK_TYPE_LABELS: todos os tipos têm label", () => {
  const types: PageBuilderBlockType[] = [
    "heading",
    "paragraph",
    "image",
    "gallery",
    "youtube",
    "button",
  ];
  for (const type of types) {
    assert.ok(BLOCK_TYPE_LABELS[type], `Missing label for ${type}`);
    assert.ok(BLOCK_TYPE_LABELS[type].length > 0);
  }
});

// ============================================================================
// Integração: fluxo completo
// ============================================================================

test("integração: criar seção, adicionar coluna, adicionar bloco", () => {
  // Cria seção
  const section = createSection();
  assert.equal(section.columns.length, 1);

  // Adiciona coluna
  const newColumn = createColumn(50);
  section.columns.push(newColumn);
  assert.equal(section.columns.length, 2);

  // Adiciona bloco
  const block = createBlock("heading");
  section.columns[0]!.blocks.push(block);
  assert.equal(section.columns[0]!.blocks.length, 1);
  assert.equal(section.columns[0]!.blocks[0]!.type, "heading");

  // Normaliza e verifica
  const content: PageBuilderContent = { sections: [section] };
  const normalized = normalizeContent(content);
  assert.equal(normalized.sections.length, 1);
  assert.equal(normalized.sections[0]!.columns.length, 2);
  assert.equal(normalized.sections[0]!.columns[0]!.blocks.length, 1);
});

test("integração: múltiplas seções com múltiplas colunas", () => {
  const content: PageBuilderContent = {
    sections: [
      {
        id: "s1",
        columns: [
          { id: "c1", width: 50, blocks: [{ id: "b1", type: "heading" }] },
          { id: "c2", width: 50, blocks: [{ id: "b2", type: "paragraph" }] },
        ],
      },
      {
        id: "s2",
        columns: [
          { id: "c3", width: 100, blocks: [{ id: "b3", type: "image" }] },
        ],
      },
    ],
  };

  const normalized = normalizeContent(content);
  assert.equal(normalized.sections.length, 2);
  assert.equal(normalized.sections[0]!.columns.length, 2);
  assert.equal(normalized.sections[1]!.columns.length, 1);
  assert.equal(normalized.sections[0]!.columns[0]!.blocks[0]!.type, "heading");
  assert.equal(normalized.sections[0]!.columns[1]!.blocks[0]!.type, "paragraph");
  assert.equal(normalized.sections[1]!.columns[0]!.blocks[0]!.type, "image");
});

test("operações: adiciona e remove seção sem mutar o conteúdo anterior", () => {
  const initial: PageBuilderContent = { sections: [] };
  const withSection = addSection(initial);
  const sectionId = withSection.sections[0]!.id;

  assert.equal(initial.sections.length, 0);
  assert.equal(withSection.sections.length, 1);
  assert.deepEqual(removeSection(withSection, sectionId), { sections: [] });
});

test("operações: alterna a grade entre 1, 2 e 3 colunas", () => {
  const section = createSection();
  const initial: PageBuilderContent = { sections: [section] };
  const twoColumns = setSectionColumnCount(initial, section.id, 2);
  const threeColumns = setSectionColumnCount(twoColumns, section.id, 3);
  const oneColumn = setSectionColumnCount(threeColumns, section.id, 1);

  assert.deepEqual(twoColumns.sections[0]!.columns.map((column) => column.width), [50, 50]);
  assert.deepEqual(threeColumns.sections[0]!.columns.map((column) => column.width), [33, 34, 33]);
  assert.deepEqual(oneColumn.sections[0]!.columns.map((column) => column.width), [100]);
});

test("operações: adiciona e remove coluna sem permitir seção sem coluna", () => {
  const section = createSection();
  const initial: PageBuilderContent = { sections: [section] };
  const twoColumns = addColumnToSection(initial, section.id);
  const addedColumn = twoColumns.sections[0]!.columns[1]!;
  const oneColumn = removeColumnFromSection(twoColumns, section.id, addedColumn.id);
  const protectedColumn = removeColumnFromSection(oneColumn, section.id, section.columns[0]!.id);

  assert.equal(twoColumns.sections[0]!.columns.length, 2);
  assert.equal(oneColumn.sections[0]!.columns.length, 1);
  assert.equal(protectedColumn.sections[0]!.columns.length, 1);
});

test("operações: adiciona e remove bloco em uma coluna", () => {
  const section = createSection();
  const column = section.columns[0]!;
  const initial: PageBuilderContent = { sections: [section] };
  const withBlock = addBlockToColumn(initial, section.id, column.id, "image");
  const block = withBlock.sections[0]!.columns[0]!.blocks[0]!;
  const withoutBlock = removeBlockFromColumn(withBlock, section.id, column.id, block.id);

  assert.equal(block.type, "image");
  assert.equal(withoutBlock.sections[0]!.columns[0]!.blocks.length, 0);
});
