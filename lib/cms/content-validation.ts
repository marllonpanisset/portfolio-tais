import type {
  CmsPageContentByTemplate,
  CmsPageTemplate,
} from "./content-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactStringFields(
  value: Record<string, unknown>,
  fields: readonly string[],
): boolean {
  const keys = Object.keys(value);
  return (
    keys.length === fields.length &&
    fields.every((field) => typeof value[field] === "string")
  );
}

function isHomeContent(value: unknown): value is CmsPageContentByTemplate["home"] {
  return isRecord(value) && hasExactStringFields(value, ["galleryLabel"]);
}

function isBiographyContent(
  value: unknown,
): value is CmsPageContentByTemplate["biography"] {
  if (!isRecord(value)) return false;
  const stringFields = ["publicName", "profileImage", "introduction", "biography"];
  const keys = Object.keys(value);
  return (
    keys.length === stringFields.length + 1 &&
    stringFields.every((field) => typeof value[field] === "string") &&
    Array.isArray(value.about) &&
    value.about.every((item: unknown) => typeof item === "string")
  );
}

function isContactContent(
  value: unknown,
): value is CmsPageContentByTemplate["contact"] {
  return isRecord(value) &&
    hasExactStringFields(value, ["title", "subtitle", "informationText"]);
}

function isPortfolioContent(
  value: unknown,
): value is CmsPageContentByTemplate["portfolio"] {
  return isRecord(value) && hasExactStringFields(value, ["eyebrow", "title", "description"]);
}

function isGlobalContent(
  value: unknown,
): value is CmsPageContentByTemplate["global"] {
  return isRecord(value) && hasExactStringFields(value, ["publicName", "brandName"]);
}

/**
 * Validates an untrusted JSON value against the editorial content contract
 * for the requested template. Invalid or legacy Page Builder content returns null.
 */
export function parseCmsPageContent<Template extends CmsPageTemplate>(
  template: Template,
  content: unknown,
): CmsPageContentByTemplate[Template] | null {
  switch (template) {
    case "home":
      return (isHomeContent(content) ? content : null) as CmsPageContentByTemplate[Template] | null;
    case "biography":
      return (isBiographyContent(content) ? content : null) as CmsPageContentByTemplate[Template] | null;
    case "contact":
      return (isContactContent(content) ? content : null) as CmsPageContentByTemplate[Template] | null;
    case "portfolio":
      return (isPortfolioContent(content) ? content : null) as CmsPageContentByTemplate[Template] | null;
    case "global":
      return (isGlobalContent(content) ? content : null) as CmsPageContentByTemplate[Template] | null;
  }
}
