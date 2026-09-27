/** A portfolio category is content data, not a presentation string embedded in a component. */
export interface PortfolioCategory {
  id: string;
  slug: string;
  name: string;
  order: number;
}

export type PortfolioMediaKind = "image" | "video";

/** Reference to media associated with a portfolio project. */
export interface PortfolioMedia {
  id: string;
  kind: PortfolioMediaKind;
  src: string;
  alt?: string;
  caption?: string;
  order: number;
}

export type PortfolioPublicationStatus = "draft" | "published";

/** Domain shape only; this does not imply a CMS, persistence, or CRUD implementation. */
export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  categoryId: PortfolioCategory["id"];
  year?: number;
  description: string;
  media: PortfolioMedia[];
  credits?: Array<{ name: string; role?: string }>;
  order: number;
  status: PortfolioPublicationStatus;
}
