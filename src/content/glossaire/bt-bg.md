---
terme: "BT / BG (Business Term / Business Group)"
categorie: "Norme"
voir_aussi: ["en-16931", "cius", "ubl-2-1"]
---

**BT** (Business Term) et **BG** (Business Group) sont les unités sémantiques de la norme EN 16931. Un BT est un champ élémentaire porteur d'une information métier (par exemple BT-1 = numéro de facture, BT-5 = code devise, BT-9 = date d'échéance). Un BG est un groupe fonctionnel qui regroupe plusieurs BT et éventuellement d'autres BG (par exemple BG-4 = vendeur, contenant BT-27 nom légal, BT-31 identifiant TVA, BG-5 adresse postale).

La norme EN 16931 définit environ 180 BT et une quarantaine de BG. Chaque élément est caractérisé par : un identifiant (BT-n), un libellé sémantique, un type de donnée (texte, montant, date, code d'une liste contrôlée), une cardinalité (obligatoire, optionnel, multiple) et une description fonctionnelle. Les syntaxes UBL 2.1 et CII mappent chacune ces BT/BG vers leurs éléments XML respectifs.

La maîtrise du référentiel BT/BG est essentielle pour les équipes MOA et MOE qui conçoivent les interfaces ERP ↔ PA : elle permet de traduire un besoin fonctionnel (« je veux transmettre une référence de bon de commande ») en champ normalisé (BT-13 = Purchase order reference) et de garantir l'interopérabilité. Le FNFE-MPE publie un tableur de correspondance BT/BG ↔ UBL ↔ CII ↔ Factur-X qui fait référence dans l'écosystème français.
