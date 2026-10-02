"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { Route } from "next";
import type { PageRow } from "@/types/database";
import {
  type PageBuilderContent,
  type PageBuilderSection,
  type PageBuilderColumn,
  type PageBuilderBlock,
  type PageBuilderBlockType,
  type ColumnCount,
  createBlock,
  addSection as addSectionToContent,
  removeSection as removeSectionFromContent,
  setSectionColumnCount,
  addColumnToSection,
  removeColumnFromSection,
  addBlockToColumn,
  removeBlockFromColumn,
  normalizeContent,
  BLOCK_TYPE_LABELS,
  BLOCK_TYPE_DESCRIPTIONS,
} from "@/lib/cms/page-builder";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface PageEditorProps {
  page: PageRow;
}

type SelectionType = "section" | "column" | "block";

interface Selection {
  type: SelectionType;
  sectionId: string;
  columnId?: string;
  blockId?: string;
}

// ============================================================================
// Component
// ============================================================================

export function PageEditor({ page }: PageEditorProps) {
  const [content, setContent] = useState<PageBuilderContent>(() =>
    normalizeContent(page.content),
  );
  const [selection, setSelection] = useState<Selection | null>(null);

  // ==========================================================================
  // Section Operations
  // ==========================================================================

  const addSection = useCallback(() => {
    const nextContent = addSectionToContent(content);
    const newSection = nextContent.sections.at(-1);
    setContent(nextContent);
    if (!newSection) return;
    setSelection({ type: "section", sectionId: newSection.id });
  }, [content]);

  const removeSection = useCallback((sectionId: string) => {
    setContent((prev) => removeSectionFromContent(prev, sectionId));
    setSelection((prev) =>
      prev?.sectionId === sectionId ? null : prev,
    );
  }, []);

  const setColumnCount = useCallback(
    (sectionId: string, count: ColumnCount) => {
      setContent((prev) => setSectionColumnCount(prev, sectionId, count));
      setSelection({ type: "section", sectionId });
    },
    [],
  );

  // ==========================================================================
  // Column Operations
  // ==========================================================================

  const addColumn = useCallback((sectionId: string) => {
    setContent((prev) => addColumnToSection(prev, sectionId));
  }, []);

  const removeColumn = useCallback(
    (sectionId: string, columnId: string) => {
      setContent((prev) => removeColumnFromSection(prev, sectionId, columnId));
      setSelection((prev) =>
        prev?.columnId === columnId ? null : prev,
      );
    },
    [],
  );

  // ==========================================================================
  // Block Operations
  // ==========================================================================

  const addBlock = useCallback(
    (sectionId: string, columnId: string, type: PageBuilderBlockType) => {
      const newBlock = createBlock(type);
      setContent((prev) => addBlockToColumn(prev, sectionId, columnId, type, newBlock));
      setSelection({
        type: "block",
        sectionId,
        columnId,
        blockId: newBlock.id,
      });
    },
    [],
  );

  const removeBlock = useCallback(
    (sectionId: string, columnId: string, blockId: string) => {
      setContent((prev) => removeBlockFromColumn(prev, sectionId, columnId, blockId));
      setSelection((prev) =>
        prev?.blockId === blockId ? null : prev,
      );
    },
    [],
  );

  // ==========================================================================
  // Selection Helpers
  // ==========================================================================

  const selectSection = useCallback((sectionId: string) => {
    setSelection({ type: "section", sectionId });
  }, []);

  const selectColumn = useCallback(
    (sectionId: string, columnId: string) => {
      setSelection({ type: "column", sectionId, columnId });
    },
    [],
  );

  const selectBlock = useCallback(
    (sectionId: string, columnId: string, blockId: string) => {
      setSelection({
        type: "block",
        sectionId,
        columnId,
        blockId,
      });
    },
    [],
  );

  // ==========================================================================
  // Render Helpers
  // ==========================================================================

  const isSectionSelected = (sectionId: string) =>
    selection?.type === "section" && selection.sectionId === sectionId;

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="fixed inset-0 z-50 flex h-screen flex-col bg-surface">
      {/* TOP BAR */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/70 bg-surface-elevated px-4">
        <div className="flex items-center gap-3">
          <Link
            href={"/admin/paginas" as Route}
            className="inline-flex h-8 items-center justify-center rounded-[var(--radius-sm)] border border-border/70 bg-surface px-3 text-xs font-medium text-text-secondary transition-colors hover:border-border hover:text-text-primary"
          >
            Fechar
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-medium text-text-primary">
            {page.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="inline-flex h-8 items-center justify-center rounded-[var(--radius-sm)] border border-border/70 bg-surface px-3 text-xs font-medium text-text-secondary opacity-50 cursor-not-allowed"
            title="Em breve"
          >
            Visualizar
          </button>
          <button
            disabled
            className="inline-flex h-8 items-center justify-center rounded-[var(--radius-sm)] bg-signal px-3 text-xs font-medium text-white opacity-50 cursor-not-allowed"
            title="Em breve"
          >
            Salvar
          </button>
        </div>
      </header>

      {/* MAIN AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="flex w-52 shrink-0 flex-col border-r border-border/70 bg-surface-elevated sm:w-64">
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
              Elementos
            </h2>
            <div className="space-y-1">
              {(
                Object.keys(BLOCK_TYPE_LABELS) as PageBuilderBlockType[]
              ).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    if (selection?.columnId && selection?.sectionId) {
                      addBlock(
                        selection.sectionId,
                        selection.columnId,
                        type,
                      );
                    }
                  }}
                  disabled={!selection?.columnId}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[var(--radius-sm)] border border-transparent px-3 py-2 text-left text-sm transition-colors",
                    selection?.columnId
                      ? "text-text-secondary hover:border-border/70 hover:bg-surface hover:text-text-primary cursor-pointer"
                      : "text-text-muted opacity-50 cursor-not-allowed",
                  )}
                  title={
                    selection?.columnId
                      ? `Adicionar ${BLOCK_TYPE_LABELS[type]}`
                      : "Selecione uma coluna primeiro"
                  }
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded border border-border/70 bg-surface text-[10px] font-medium uppercase text-text-muted">
                    {BLOCK_TYPE_LABELS[type].charAt(0)}
                  </span>
                  <span>{BLOCK_TYPE_LABELS[type]}</span>
                </button>
              ))}
            </div>

            <div className="my-4 h-px bg-border" />

            <button
              onClick={addSection}
              className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] border border-dashed border-border px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:border-border hover:bg-surface hover:text-text-primary cursor-pointer"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded border border-border/70 bg-surface text-text-muted">
                +
              </span>
              <span>Nova seção</span>
            </button>
          </div>
        </aside>

        {/* CANVAS */}
        <main className="flex-1 overflow-y-auto bg-surface p-4 sm:p-8">
          {content.sections.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="text-sm text-text-muted">
                Esta página ainda não possui conteúdo.
              </p>
              <button
                onClick={addSection}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-border px-5 text-sm font-medium text-text-secondary transition-colors hover:border-border hover:bg-surface-elevated hover:text-text-primary cursor-pointer"
              >
                + Adicionar seção
              </button>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl space-y-6">
              {content.sections.map((section) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  isSelected={isSectionSelected(section.id)}
                  selectedColumnId={
                    selection?.sectionId === section.id
                      ? selection.columnId
                      : undefined
                  }
                  selectedBlockId={
                    selection?.sectionId === section.id
                      ? selection.blockId
                      : undefined
                  }
                  onSelect={() => selectSection(section.id)}
                  onRemove={() => removeSection(section.id)}
                  onSetColumnCount={(count) =>
                    setColumnCount(section.id, count)
                  }
                  onAddColumn={() => addColumn(section.id)}
                  onRemoveColumn={(columnId) =>
                    removeColumn(section.id, columnId)
                  }
                  onSelectColumn={(columnId) =>
                    selectColumn(section.id, columnId)
                  }
                  onSelectBlock={(columnId, blockId) =>
                    selectBlock(section.id, columnId, blockId)
                  }
                  onRemoveBlock={(columnId, blockId) =>
                    removeBlock(section.id, columnId, blockId)
                  }
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// Section Editor
// ============================================================================

interface SectionEditorProps {
  section: PageBuilderSection;
  isSelected: boolean;
  selectedColumnId?: string;
  selectedBlockId?: string;
  onSelect: () => void;
  onRemove: () => void;
  onSetColumnCount: (count: ColumnCount) => void;
  onAddColumn: () => void;
  onRemoveColumn: (columnId: string) => void;
  onSelectColumn: (columnId: string) => void;
  onSelectBlock: (columnId: string, blockId: string) => void;
  onRemoveBlock: (columnId: string, blockId: string) => void;
}

function SectionEditor({
  section,
  isSelected,
  selectedColumnId,
  selectedBlockId,
  onSelect,
  onRemove,
  onSetColumnCount,
  onAddColumn,
  onRemoveColumn,
  onSelectColumn,
  onSelectBlock,
  onRemoveBlock,
}: SectionEditorProps) {
  const columnCount = section.columns.length;

  return (
    <div
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Selecionar seção"
      className={cn(
        "group relative rounded-lg border-2 p-4 transition-colors cursor-pointer",
        isSelected
          ? "border-signal bg-surface-elevated"
          : "border-transparent hover:border-border/70 hover:bg-surface-elevated/50",
      )}
    >
      {/* Section Controls */}
      <div
        className={cn(
          "absolute -top-3 left-4 flex items-center gap-1",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
        )}
      >
        <div className="flex items-center gap-1 rounded-md border border-border/70 bg-surface-elevated px-1 py-0.5 shadow-sm">
          <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-text-muted">
            Seção
          </span>
          <div className="h-3 w-px bg-border" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetColumnCount(1);
            }}
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded text-[10px] font-medium transition-colors cursor-pointer",
              columnCount === 1
                ? "bg-signal text-white"
                : "text-text-secondary hover:bg-surface",
            )}
            title="1 coluna"
          >
            1
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetColumnCount(2);
            }}
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded text-[10px] font-medium transition-colors cursor-pointer",
              columnCount === 2
                ? "bg-signal text-white"
                : "text-text-secondary hover:bg-surface",
            )}
            title="2 colunas"
          >
            2
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetColumnCount(3);
            }}
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded text-[10px] font-medium transition-colors cursor-pointer",
              columnCount === 3
                ? "bg-signal text-white"
                : "text-text-secondary hover:bg-surface",
            )}
            title="3 colunas"
          >
            3
          </button>
          <div className="h-3 w-px bg-border" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddColumn();
            }}
            disabled={columnCount >= 3}
            className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-medium text-text-secondary transition-colors hover:bg-surface cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Adicionar coluna"
          >
            +
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-medium text-red-400 transition-colors hover:bg-red-500/10 cursor-pointer"
            title="Remover seção"
          >
            ×
          </button>
        </div>
      </div>

      {/* Columns */}
      <div
        className={cn(
          "grid gap-4",
          columnCount === 1 && "grid-cols-1",
          columnCount === 2 && "grid-cols-1 sm:grid-cols-2",
          columnCount === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {section.columns.map((column) => (
          <ColumnEditor
            key={column.id}
            column={column}
            isSelected={selectedColumnId === column.id}
            selectedBlockId={selectedBlockId}
            onSelect={() => onSelectColumn(column.id)}
            onRemove={() => onRemoveColumn(column.id)}
            onSelectBlock={(blockId) =>
              onSelectBlock(column.id, blockId)
            }
            onRemoveBlock={(blockId) =>
              onRemoveBlock(column.id, blockId)
            }
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Column Editor
// ============================================================================

interface ColumnEditorProps {
  column: PageBuilderColumn;
  isSelected: boolean;
  selectedBlockId?: string;
  onSelect: () => void;
  onRemove: () => void;
  onSelectBlock: (blockId: string) => void;
  onRemoveBlock: (blockId: string) => void;
}

function ColumnEditor({
  column,
  isSelected,
  selectedBlockId,
  onSelect,
  onRemove,
  onSelectBlock,
  onRemoveBlock,
}: ColumnEditorProps) {
  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Selecionar coluna"
      className={cn(
        "group/col relative min-h-[120px] rounded-md border-2 p-3 transition-colors cursor-pointer",
        isSelected
          ? "border-signal/50 bg-surface-elevated"
          : "border-dashed border-border/50 hover:border-border hover:bg-surface-elevated/30",
      )}
    >
      {/* Column Controls */}
      <div
        className={cn(
          "absolute -top-3 right-2 flex items-center gap-1",
          isSelected
            ? "opacity-100"
            : "opacity-0 group-hover/col:opacity-100 group-focus-within/col:opacity-100",
        )}
      >
        <div className="flex items-center gap-1 rounded-md border border-border/70 bg-surface-elevated px-1 py-0.5 shadow-sm">
          <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-text-muted">
            Coluna
          </span>
          <div className="h-3 w-px bg-border" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-medium text-red-400 transition-colors hover:bg-red-500/10 cursor-pointer"
            title="Remover coluna"
          >
            ×
          </button>
        </div>
      </div>

      {/* Blocks */}
      {column.blocks.length === 0 ? (
        <div className="flex h-full min-h-[80px] items-center justify-center">
          <p className="text-xs text-text-muted/50">
            Coluna vazia
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {column.blocks.map((block) => (
            <BlockPlaceholder
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              onSelect={() => onSelectBlock(block.id)}
              onRemove={() => onRemoveBlock(block.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Block Placeholder
// ============================================================================

interface BlockPlaceholderProps {
  block: PageBuilderBlock;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function BlockPlaceholder({
  block,
  isSelected,
  onSelect,
  onRemove,
}: BlockPlaceholderProps) {
  const label = BLOCK_TYPE_LABELS[block.type];
  const description = BLOCK_TYPE_DESCRIPTIONS[block.type];

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Selecionar bloco ${label}`}
      className={cn(
        "group/block relative rounded-md border-2 p-3 transition-colors cursor-pointer",
        isSelected
          ? "border-signal bg-surface-elevated"
          : "border-border/50 bg-surface-elevated/50 hover:border-border hover:bg-surface-elevated",
      )}
    >
      {/* Block Controls */}
      <div
        className={cn(
          "absolute -top-3 right-2 flex items-center gap-1",
          isSelected
            ? "opacity-100"
            : "opacity-0 group-hover/block:opacity-100 group-focus-within/block:opacity-100",
        )}
      >
        <div className="flex items-center gap-1 rounded-md border border-border/70 bg-surface-elevated px-1 py-0.5 shadow-sm">
          <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-text-muted">
            {label}
          </span>
          <div className="h-3 w-px bg-border" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-medium text-red-400 transition-colors hover:bg-red-500/10 cursor-pointer"
            title="Remover bloco"
          >
            ×
          </button>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border/70 bg-surface text-xs font-medium uppercase text-text-muted">
          {label.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-primary">
            {label}
          </p>
          <p className="text-[10px] text-text-muted">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
