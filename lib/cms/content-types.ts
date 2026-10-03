export type CmsPageTemplate =
  | "home"
  | "biography"
  | "contact"
  | "global"
  | "portfolio";

export interface HomePageContent {
  galleryLabel: string;
}

export interface BiographyPageContent {
  publicName: string;
  profileImage: string;
  introduction: string;
  biography: string;
  about: string[];
}

export interface PortfolioPageContent {
  eyebrow: string;
  title: string;
  description: string;
}

export interface ContactPageContent {
  title: string;
  subtitle: string;
  informationText: string;
}

export interface GlobalContent {
  publicName: string;
  brandName: string;
}

export type CmsPageContentByTemplate = {
  home: HomePageContent;
  biography: BiographyPageContent;
  contact: ContactPageContent;
  global: GlobalContent;
  portfolio: PortfolioPageContent;
};

export type CmsPageContentRecord = {
  [Template in CmsPageTemplate]: {
    template: Template;
    content: CmsPageContentByTemplate[Template];
  };
}[CmsPageTemplate];
