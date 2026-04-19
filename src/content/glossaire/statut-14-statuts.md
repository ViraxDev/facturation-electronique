---
terme: "Statut (14 statuts du cycle de vie)"
categorie: "Concept"
voir_aussi: ["cycle-de-vie-facture", "plateforme-agreee"]
---

Le modèle des **14 statuts** est le référentiel normalisé publié par la DGFiP dans les spécifications externes du PPF qui encadre la remontée du cycle de vie d'une facture électronique. Chaque changement de statut est horodaté et transmis par la PA, permettant une traçabilité fine aux trois parties prenantes : émetteur, destinataire, administration.

Les 14 statuts se répartissent en deux familles. **Statuts obligatoires** (remontés par la PA pour tout flux) : Déposée, Rejetée (non-conformité technique ou sémantique), Refusée (par le destinataire pour motif métier), Mise à disposition, Prise en charge, Approuvée, Approuvée partiellement, Mise en paiement, Encaissée, Suspendue. **Statuts complémentaires recommandés** : Reçue par le destinataire, Litige, Annulée, Remboursée.

Chaque statut est associé à un code, un libellé normalisé et un champ commentaire libre. Les motifs de refus ou rejet s'appuient sur une nomenclature contrôlée (par exemple : montant HT incohérent, TVA erronée, SIRET invalide, duplicata). Cette standardisation permet aux éditeurs d'ERP de construire des tableaux de bord unifiés quelle que soit la PA utilisée par le partenaire, et à l'administration de mesurer l'état global des factures en circulation. Les PA doivent restituer ces statuts via des webhooks ou des API REST à leurs clients.
