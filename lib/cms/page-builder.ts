/** Estrutura e operações puras do editor visual de páginas (CMS 08.2). */

export type PageBuilderBlockType =
  | "heading"
  | "paragraph"
  | "image"
  | "gallery"
  | "youtube"
  | "button";

export type PageBuilderColumnWidth = 33 | 34 | 50 | 100;

export interface PageBuilderBlock {
  id: string;
  type: PageBuilderBlockType;
}

export interface PageBuilderColumn {
  id: string;
  width: PageBuilderColumnWidth;
  blocks: PageBuilderBlock[];
}

export interface PageBuilderSection {
  id: string;
  columns: PageBuilderColumn[];
}

export interface PageBuilderContent {
  sections: PageBuilderSection[];
}

export const COLUMN_WIDTHS = {
  1: [100],
  2: [50, 50],
  3: [33, 34, 33],
} as const satisfies Record<1 | 2 | 3, readonly PageBuilderColumnWidth[]>;

export type ColumnCount = keyof typeof COLUMN_WIDTHS;

const BLOCK_TYPES: readonly PageBuilderBlockType[] = [
  "heading", "paragraph", "image", "gallery", "youtube", "button",
];

let idCounter = 0;

function generateId(): string {
  idCounter += 1;
  return `pb_${Date.now().toString(36)}_${idCounter.toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBlockType(value: unknown): value is PageBuilderBlockType {
  return typeof value === "string" && BLOCK_TYPES.includes(value as PageBuilderBlockType);
}

export function isValidColumnWidth(value: unknown): value is PageBuilderColumnWidth {
  return value === 33 || value === 34 || value === 50 || value === 100;
}

function createUniqueId(candidate: unknown, usedIds: Set<string>): string {
  if (typeof candidate === "string" && candidate.length > 0 && !usedIds.has(candidate)) {
    usedIds.add(candidate);
    return candidate;
  }

  let id = generateId();
  while (usedIds.has(id)) id = generateId();
  usedIds.add(id);
  return id;
}

/** Cria um bloco placeholder do tipo informado. */
export function createBlock(type: PageBuilderBlockType): PageBuilderBlock {
  return { id: generateId(), type };
}

/** Cria uma coluna vazia. Larguras fora da grade disponível retornam a padrão. */
export function createColumn(width: number = 100): PageBuilderColumn {
  return { id: generateId(), width: isValidColumnWidth(width) ? width : 100, blocks: [] };
}

/** Cria uma seção com uma única coluna vazia. */
export function createSection(): PageBuilderSection {
  return { id: generateId(), columns: [createColumn()] };
}

/** Aceita o JSONB inicial { sections: [] } e descarta dados estruturais inválidos. */
export function normalizeContent(raw: unknown): PageBuilderContent {
  if (!isRecord(raw) || !Array.isArray(raw.sections)) return { sections: [] };

  const usedIds = new Set<string>();
  const sections: PageBuilderSection[] = [];
  for (const sectionValue of raw.sections) {
    if (!isRecord(sectionValue) || !Array.isArray(sectionValue.columns)) continue;

    const columns: PageBuilderColumn[] = [];
    for (const columnValue of sectionValue.columns) {
      if (!isRecord(columnValue) || !Array.isArray(columnValue.blocks)) continue;

      const blocks: PageBuilderBlock[] = [];
      for (const blockValue of columnValue.blocks) {
        if (!isRecord(blockValue) || !isBlockType(blockValue.type)) continue;
        blocks.push({ id: createUniqueId(blockValue.id, usedIds), type: blockValue.type });
      }
      columns.push({
        id: createUniqueId(columnValue.id, usedIds),
        width: isValidColumnWidth(columnValue.width) ? columnValue.width : 100,
        blocks,
      });
    }
    sections.push({ id: createUniqueId(sectionValue.id, usedIds), columns });
  }
  return { sections };
}

/** Verifica a estrutura completa antes de utilizá-la sem normalização. */
export function isPageBuilderContent(value: unknown): value is PageBuilderContent {
  if (!isRecord(value) || !Array.isArray(value.sections)) return false;
  return value.sections.every(
    (section) => isRecord(section) && typeof section.id === "string" && Array.isArray(section.columns) && section.columns.every(
      (column) => isRecord(column) && typeof column.id === "string" && isValidColumnWidth(column.width) && Array.isArray(column.blocks) && column.blocks.every(
        (block) => isRecord(block) && typeof block.id === "string" && isBlockType(block.type),
      ),
    ),
  );
}

/** Operações imutáveis usadas exclusivamente pelo estado local do editor. */
export function addSection(content: PageBuilderContent): PageBuilderContent {
  return { sections: [...content.sections, createSection()] };
}

export function removeSection(content: PageBuilderContent, sectionId: string): PageBuilderContent {
  return { sections: content.sections.filter((section) => section.id !== sectionId) };
}

export function setSectionColumnCount(content: PageBuilderContent, sectionId: string, count: ColumnCount): PageBuilderContent {
  return {
    sections: content.sections.map((section) => {
      if (section.id !== sectionId) return section;
      const columns = COLUMN_WIDTHS[count].map((width, index) => {
        const current = section.columns[index];
        return current ? { ...current, width } : createColumn(width);
      });
      return { ...section, columns };
    }),
  };
}

export function addColumnToSection(content: PageBuilderContent, sectionId: string): PageBuilderContent {
  const section = content.sections.find((item) => item.id === sectionId);
  if (!section || section.columns.length >= 3) return content;
  return setSectionColumnCount(content, sectionId, (section.columns.length + 1) as ColumnCount);
}

export function removeColumnFromSection(content: PageBuilderContent, sectionId: string, columnId: string): PageBuilderContent {
  const section = content.sections.find((item) => item.id === sectionId);
  if (!section || section.columns.length <= 1 || !section.columns.some((column) => column.id === columnId)) return content;

  const remaining = section.columns.filter((column) => column.id !== columnId);
  const widths = COLUMN_WIDTHS[remaining.length as ColumnCount];
  const columns = remaining.map((column, index) => ({ ...column, width: widths[index] ?? 100 }));
  return {
    sections: content.sections.map((item) => item.id === sectionId ? { ...item, columns } : item),
  };
}

export function addBlockToColumn(
  content: PageBuilderContent,
  sectionId: string,
  columnId: string,
  type: PageBuilderBlockType,
  block: PageBuilderBlock = createBlock(type),
): PageBuilderContent {
  return {
    sections: content.sections.map((section) => section.id !== sectionId ? section : {
      ...section,
      columns: section.columns.map((column) => column.id === columnId ? { ...column, blocks: [...column.blocks, block] } : column),
    }),
  };
}

export function removeBlockFromColumn(content: PageBuilderContent, sectionId: string, columnId: string, blockId: string): PageBuilderContent {
  return {
    sections: content.sections.map((section) => section.id !== sectionId ? section : {
      ...section,
      columns: section.columns.map((column) => column.id === columnId ? { ...column, blocks: column.blocks.filter((block) => block.id !== blockId) } : column),
    }),
  };
}

export const BLOCK_TYPE_LABELS: Record<PageBuilderBlockType, string> = {
  heading: "Título", paragraph: "Parágrafo", image: "Imagem", gallery: "Galeria", youtube: "YouTube", button: "Botão",
};

export const BLOCK_TYPE_DESCRIPTIONS: Record<PageBuilderBlockType, string> = {
  heading: "Bloco de título", paragraph: "Bloco de parágrafo", image: "Bloco de imagem", gallery: "Bloco de galeria", youtube: "Bloco de vídeo do YouTube", button: "Bloco de botão",
};
