---
terme: "UBL 2.1"
categorie: "Format"
voir_aussi: ["factur-x", "un-cefact-cii", "en-16931"]
---

**UBL 2.1** (Universal Business Language) est un standard ouvert maintenu par OASIS qui définit un vocabulaire XML pour les documents commerciaux (commande, bon de livraison, facture, avoir, etc.). La version 2.1, publiée en 2013, est l'une des syntaxes admises par la norme EN 16931 et l'un des trois formats pivots retenus par la DGFiP pour l'e-invoicing français.

UBL est massivement utilisé dans l'écosystème **Peppol** (Pan-European Public Procurement On-Line), ce qui facilite les échanges transfrontaliers. Il est également la syntaxe privilégiée dans de nombreux pays européens (Pays-Bas, Belgique, pays nordiques, Italie via FatturaPA avec adaptations) et au-delà (Singapour, Australie).

Contrairement à Factur-X, UBL est un XML pur sans représentation visuelle embarquée : la lisibilité humaine nécessite un stylesheet ou un rendu par l'outil récepteur. Cette pureté structurelle convient aux organisations disposant d'un traitement entièrement automatisé (grands comptes, ETI matures). Les CIUS (Core Invoice Usage Specifications) nationales permettent d'adapter UBL 2.1 aux règles métier locales, notamment le **CIUS FR** publié par le FNFE-MPE qui précise les codes et mentions obligatoires françaises tout en restant strictement conforme à EN 16931.
