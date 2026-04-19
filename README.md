# Facturation Electronique — Academy + Site commercial

Site pedagogique gamifie + site commercial B2B pour accompagner les experts-comptables dans la mise en conformite de leurs clients avec la reforme francaise de la facturation electronique (1er septembre 2026 / 1er septembre 2027).

## Stack

- Astro 5 (static-first) + MDX Content Collections
- React islands (shadcn/ui primitives)
- Tailwind CSS v4 (tokens CSS)
- nanostores + persistent (localStorage) pour la gamification
- pdfjs-dist (visualiseur Factur-X) et jspdf (certificats)
- Chart.js (calculateur ROI)
- Deploiement : Netlify

## Demarrage

```bash
make install   # installe les dependances
make dev       # serveur local http://localhost:4321
```

## Build et deploiement

```bash
make build             # genere dist/
make preview           # previsualise le build
make link              # lie un site Netlify (une seule fois)
make deploy-preview    # deploie en preview (URL unique)
make deploy            # deploie en production
```

## Architecture

```
src/
  content/          Collections MDX typees (modules, parcours, glossaire, veille)
  components/
    ui/             Primitives shadcn
    academy/        Quiz, XPBar, BadgeGrid, ProgressRing
    tools/          4 outils interactifs
    marketing/      Hero, Bento, Pricing, Timeline
    mdx/            Callout, Source, KeyNumber
    layout/         Header, Footer, AcademySidebar, MobileNav
  layouts/          BaseLayout, MarketingLayout, AcademyLayout, ModuleLayout
  pages/            Pages commerciales + /academy/*
  stores/           nanostores pour progression et badges
  lib/              Logique metier (xp-rules, factur-x-parser, certificats)
```

## Gamification

- 30 modules repartis sur 5 parcours
- 18 badges SVG
- 5 niveaux (Novice, Apprenti, Praticien, Expert, Maitre)
- Progression persistee 100% cote client (localStorage), exportable en JSON
- Certificats PDF genere cote client par parcours termine
