/**
 * Admin Authorization Guard Tests (Fase 2B.2)
 *
 * TESTE ESTRUTURAL — verifica o código-fonte, não o comportamento de
 * execução. Para cada Server Action administrativa exportada e cada página
 * do painel, afirma que `requireSiteOwner()` aparece no corpo da função
 * ANTES da primeira operação de leitura/escrita protegida, que mensagens
 * de negação usam `denialMessage` e que páginas redirecionam sem sessão
 * para o login e sem autorização para `/`.
 *
 * Não executa Actions, não toca no banco e não prova bloqueio real de
 * escrita: combinado aos testes de `site-owner-decision` e
 * `require-site-owner` (que provam a negação do helper com mocks), este
 * teste impede regressões do tipo "guarda removida/reordenada".
 *
 * Sem runner adicional: compile apenas este arquivo com
 * `npx tsc lib/supabase/admin-authorization-guard.test.ts --outDir <tmp>
 * --module commonjs --target es2022 --strict --skipLibCheck` e execute o
 * JS gerado com `node --test` a partir da raiz do repositório (o teste lê
 * os fontes via `process.cwd()`).
 *
 * Fase 2B.4: detecção insensível a quebras de linha (`supabase` `.from(`)
 * via regex, e cobertura de ordenação obrigatória — nenhuma Action pode
 * passar sem ao menos um marcador de acesso válido (falha explícita em
 * vez de aprovação silenciosa).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = process.cwd();

function readSource(relativePath: string): string {
  const absolute = path.join(REPO_ROOT, relativePath);
  assert.ok(
    fs.existsSync(absolute),
    `fonte ausente (execute a partir da raiz do repo): ${relativePath}`,
  );
  return fs.readFileSync(absolute, "utf8");
}

/** Corpo de `export async function NAME(` até o próximo export ou EOF. */
function functionBody(source: string, name: string): string {
  const start = source.indexOf(`export async function ${name}(`);
  assert.ok(start >= 0, `Action exportada ausente: ${name}`);
  const rest = source.slice(start);
  const next = rest.indexOf("\nexport async function ", 1);
  return next === -1 ? rest : rest.slice(0, next);
}

/** Corpo do componente/página `export default async function` até EOF. */
function defaultExportBody(source: string): string {
  const start = source.indexOf("export default async function");
  assert.ok(start >= 0, "página sem `export default async function`");
  return source.slice(start);
}

/**
 * Chamadas diretas ao cliente encadeadas com quebra de linha, que
 * marcadores literais não alcançam:
 *
 *   supabase.from(...)
 *   supabase
 *     .from(...)
 *
 * Regex sem flag global (`search` não altera `lastIndex`).
 */
const SUPABASE_CHAINED_PATTERNS: RegExp[] = [
  /supabase\s*\.\s*from\s*\(/,
  /supabase\s*\.\s*storage\b/,
];

/** Primeiro acesso a dados por literal ou padrão; `index === -1` = sem cobertura. */
function firstDataAccess(
  body: string,
  markers: string[],
  patterns: RegExp[] = SUPABASE_CHAINED_PATTERNS,
): { index: number; via: string } {
  let first = -1;
  let via = "";
  for (const marker of markers) {
    const i = body.indexOf(marker);
    if (i !== -1 && (first === -1 || i < first)) {
      first = i;
      via = marker;
    }
  }
  for (const pattern of patterns) {
    const i = body.search(pattern);
    if (i !== -1 && (first === -1 || i < first)) {
      first = i;
      via = String(pattern);
    }
  }
  return { index: first, via };
}

// ============================================================================
// Server Actions: guarda presente e ordenada antes do primeiro acesso a dados
// ============================================================================

const ACTION_FILES: Array<{
  file: string;
  expectedExports: string[];
  dataMarkers: string[];
}> = [
  {
    file: "app/admin/(painel)/projetos/actions.ts",
    expectedExports: [
      "createProject",
      "updateProject",
      "deleteProject",
      "publishProject",
      "unpublishProject",
      "listCategories",
    ],
    dataMarkers: ["supabase.from", "listAllCategories(", "resolveCategoryId("],
  },
  {
    file: "app/admin/(painel)/projetos/media/actions.ts",
    expectedExports: [
      "uploadProjectImage",
      "createYouTubeMedia",
      "updateMedia",
      "deleteMedia",
      "reorderMedia",
    ],
    dataMarkers: [
      "getMediaById(",
      "createMediaRecord(",
      "updateMediaRecord(",
      "deleteMediaRecord(",
      "getNextSortOrder(",
      "uploadImage(",
      "removeImage(",
      "supabase.from",
    ],
  },
  {
    file: "app/admin/(painel)/paginas/[id]/actions.ts",
    expectedExports: [
      "setPagePublished",
      "setProjectFeatured",
      "saveHomeGalleryLabel",
      "saveBiographyContent",
      "savePortfolioContent",
      "addPortfolioProject",
      "removePortfolioProject",
      "reorderPortfolioProjects",
      "saveContactContent",
      "uploadBiographyImage",
    ],
    dataMarkers: [
      "getPageById(",
      "supabase.from(",
      "uploadImage(",
      "removeImage(",
      "getMediaUrl(",
    ],
  },
  {
    file: "app/admin/(painel)/configuracoes/actions.ts",
    expectedExports: ["saveSiteSettings"],
    dataMarkers: ["supabase.from("],
  },
];

for (const { file, expectedExports, dataMarkers } of ACTION_FILES) {
  test(`${file}: exports esperados existem e usam requireSiteOwner()`, () => {
    const source = readSource(file);
    assert.ok(
      source.includes("require-site-owner"),
      `${file} sem import de require-site-owner`,
    );
    // Nenhuma checagem de sessão paralela: toda auth passa pelo helper.
    assert.ok(
      !source.includes("auth.getClaims("),
      `${file} com auth.getClaims() direto (usar helper)`,
    );
    assert.ok(
      !source.includes("auth.getUser("),
      `${file} com auth.getUser() direto (usar helper)`,
    );
    assert.ok(
      !source.includes("await createClient()"),
      `${file} com createClient() direto (usar helper)`,
    );
    for (const name of expectedExports) {
      const body = functionBody(source, name);
      assert.ok(
        body.includes("requireSiteOwner()"),
        `${name}: sem chamada a requireSiteOwner()`,
      );
      assert.ok(
        body.includes("authorization.denialMessage"),
        `${name}: negação sem denialMessage segura`,
      );
    }
  });

  test(`${file}: guarda ocorre antes do primeiro acesso a dados`, () => {
    const source = readSource(file);
    for (const name of expectedExports) {
      const body = functionBody(source, name);
      const guardAt = body.indexOf("requireSiteOwner()");
      assert.ok(guardAt !== -1, `${name}: guarda ausente`);
      // Sem exceção: aprovação silenciosa é proibida — sem marcador válido,
      // a cobertura de ordenação não está estabelecida e o teste falha.
      const access = firstDataAccess(body, dataMarkers);
      assert.ok(
        access.index !== -1,
        `${name}: nenhum marcador de acesso a dados — cobertura de ordenação não estabelecida`,
      );
      assert.ok(
        guardAt < access.index,
        `${name}: acesso a dados (${access.via}) antes da autorização`,
      );
    }
  });
}

// ============================================================================
// Páginas do painel: guarda antes das queries, redirects corretos
// ============================================================================

const ADMIN_PAGES = [
  "app/admin/(painel)/page.tsx",
  "app/admin/(painel)/projetos/page.tsx",
  "app/admin/(painel)/projetos/novo/page.tsx",
  "app/admin/(painel)/projetos/[id]/page.tsx",
  "app/admin/(painel)/paginas/page.tsx",
  "app/admin/(painel)/paginas/[id]/page.tsx",
  "app/admin/(painel)/configuracoes/page.tsx",
];

const PAGE_DATA_MARKERS = [
  "listAll",
  "getPage",
  "getProject",
  "getSiteSettings(",
  "getMediaUrl(",
  "getFeatured",
  "getPortfolio",
  "listFeatured",
  "listPublished",
  "supabase.from",
  "createClient(",
];

/**
 * Páginas sem queries próprias (exceção explícita e justificada):
 * dashboard renderiza conteúdo estático e a página de criação exibe apenas
 * o formulário client — todos os dados fluem pelas Server Actions guardadas.
 * Se uma query própria for adicionada a elas, o teste abaixo falha e força
 * uma decisão explícita de cobertura.
 */
const PAGES_WITHOUT_OWN_QUERIES = new Set([
  "app/admin/(painel)/page.tsx",
  "app/admin/(painel)/projetos/novo/page.tsx",
]);

for (const file of ADMIN_PAGES) {
  test(`${file}: guarda antes das queries com redirects corretos`, () => {
    const source = readSource(file);
    assert.ok(
      source.includes("require-site-owner"),
      `${file} sem import de require-site-owner`,
    );
    // redirect()/notFound() nunca podem estar dentro de try/catch genérico.
    assert.ok(!source.includes("try {"), `${file} com try/catch (risco a redirect)`);
    const body = defaultExportBody(source);
    const guardAt = body.indexOf("requireSiteOwner()");
    assert.ok(guardAt !== -1, `${file}: guarda ausente`);
    const access = firstDataAccess(body, PAGE_DATA_MARKERS);
    if (PAGES_WITHOUT_OWN_QUERIES.has(file)) {
      assert.ok(
        access.index === -1,
        `${file}: query própria inesperada — revisar cobertura de ordenação`,
      );
    } else {
      assert.ok(
        access.index !== -1,
        `${file}: nenhum marcador de query — cobertura de ordenação não estabelecida`,
      );
      assert.ok(
        guardAt < access.index,
        `${file}: query (${access.via}) antes da autorização`,
      );
    }
    assert.ok(
      body.includes('redirect("/admin/login")'),
      `${file}: sem redirect ao login para sem-sessão`,
    );
    assert.ok(
      body.includes('redirect("/")'),
      `${file}: sem redirect a / para não-owner`,
    );
    assert.ok(
      body.includes('authorization.reason === "unauthenticated"'),
      `${file}: sem distinção unauthenticated/forbidden`,
    );
  });
}
