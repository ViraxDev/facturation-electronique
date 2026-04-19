import { defineCollection, z } from "astro:content";

const modules = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    parcours: z.enum(["fondations", "ecosysteme", "technique", "e-reporting", "business"]),
    order: z.number(),
    xp: z.number().default(100),
    duration: z.number().describe("minutes"),
    objectives: z.array(z.string()),
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    quiz: z.array(
      z.object({
        question: z.string(),
        options: z.array(z.string()).min(2),
        correct: z.number().int().nonnegative(),
        explanation: z.string(),
      })
    ).default([]),
    summary: z.string().optional(),
  }),
});

const parcours = defineCollection({
  type: "data",
  schema: z.object({
    id: z.enum(["fondations", "ecosysteme", "technique", "e-reporting", "business"]),
    titre: z.string(),
    description: z.string(),
    order: z.number(),
    icone: z.string(),
    couleur: z.string(),
    badge: z.string(),
  }),
});

const glossaire = defineCollection({
  type: "content",
  schema: z.object({
    terme: z.string(),
    acronyme_de: z.string().optional(),
    categorie: z.enum(["Acteur", "Format", "Norme", "Concept", "Technique", "Reglementaire"]),
    voir_aussi: z.array(z.string()).default([]),
  }),
});

const veille = defineCollection({
  type: "content",
  schema: z.object({
    titre: z.string(),
    date: z.date(),
    categorie: z.enum(["Legislation", "Norme", "Ecosysteme", "Calendrier", "Actualite"]),
    importance: z.enum(["fondateur", "majeur", "notable", "mineur"]),
    source: z.object({ label: z.string(), url: z.string().url() }),
  }),
});

export const collections = { modules, parcours, glossaire, veille };
