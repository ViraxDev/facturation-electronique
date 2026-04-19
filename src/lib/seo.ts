export const SITE = {
  name: "Facturation Électronique 2026",
  url: "https://facturation-electronique.netlify.app",
  description:
    "Guide expert et offre clé en main pour les cabinets d'experts-comptables face à la réforme française de la facturation électronique du 1er septembre 2026.",
  locale: "fr_FR",
  author: "Tadji",
  twitter: "@tadji",
};

export type SEO = {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: "website" | "article";
  publishedAt?: Date;
};

export function resolveSEO(seo: SEO = {}) {
  const title = seo.title ? `${seo.title} · ${SITE.name}` : SITE.name;
  const description = seo.description ?? SITE.description;
  const image = seo.image ?? "/og-default.png";
  const canonical = seo.canonical ?? SITE.url;
  return { title, description, image, canonical, type: seo.type ?? "website", publishedAt: seo.publishedAt };
}
