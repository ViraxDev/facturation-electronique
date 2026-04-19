---
terme: "Profils Factur-X"
categorie: "Format"
voir_aussi: ["factur-x", "en-16931", "pdf-a-3"]
---

Les **profils Factur-X** constituent une échelle de conformité hiérarchique à cinq niveaux qui détermine la richesse des données structurées embarquées dans le XML d'une facture Factur-X. Ils permettent aux entreprises de choisir le niveau de détail adapté à leurs besoins, tout en offrant aux destinataires la garantie d'un socle minimal de données exploitables.

**Minimum** : niveau le plus basique, contient uniquement les données d'en-tête indispensables (émetteur, destinataire, total HT, TVA, TTC, devise). Il ne permet pas de traitement comptable automatisé des lignes mais garantit la reconnaissance de la facture. **Basic-WL** (Basic Without Lines) : ajoute les informations fiscales détaillées par taux de TVA, les conditions de paiement, les références. Toujours sans lignes de détail.

**Basic** : inclut en plus les lignes de facture (désignation, quantité, prix unitaire, TVA ligne), permettant le rapprochement automatique commande-facture. **EN 16931** : conformité complète à la norme européenne, avec l'ensemble des BT/BG obligatoires et optionnels prévus par EN 16931. Ce profil est le **profil recommandé** pour l'interopérabilité européenne et la réforme française. **Extended** : étend EN 16931 avec des champs spécifiques supplémentaires (sectoriels, logistiques, fiscaux avancés) utiles aux grands comptes ou aux secteurs à forte complexité (BTP, industrie). Tous les profils sont conformes PDF/A-3 et acceptés par les PA.
