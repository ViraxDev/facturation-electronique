---
terme: "Annuaire central"
categorie: "Technique"
voir_aussi: ["ppf", "plateforme-agreee", "siret"]
---

L'**Annuaire central** est la base de données de référence opérée par le PPF qui recense l'ensemble des entreprises assujetties à la TVA en France et leur Plateforme Agréée de rattachement pour la réception des factures électroniques. Il constitue la brique indispensable au routage correct dans le réseau Y : avant toute émission, la PA de l'émetteur interroge l'annuaire pour identifier la PA destinataire du client.

Chaque entrée est indexée par identifiant (SIREN, SIRET, n° TVA intracommunautaire, code service ou code routage) et précise les adresses électroniques (endpoints) à utiliser. Une entreprise peut déclarer plusieurs routages (par établissement, par BU, par type de flux) pour différencier les canaux de réception.

La mise à jour est opérée par les PA pour le compte de leurs clients, via une API normalisée. L'annuaire gère la propagation des changements (délai de bascule) pour éviter les pertes de factures lors d'un changement de PA. Son schéma s'inspire des principes du réseau Peppol (SMP/SML) tout en étant souverain et adapté aux spécificités françaises. La consultation est gratuite et accessible aux PA authentifiées ; les entreprises peuvent vérifier leur propre référencement via leur portail PA.
