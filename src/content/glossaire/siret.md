---
terme: "SIRET"
acronyme_de: "Système d'Identification du Répertoire des Établissements"
categorie: "Reglementaire"
voir_aussi: ["siren", "annuaire-central", "mentions-obligatoires"]
---

Le **SIRET** (Système d'Identification du Répertoire des Établissements) est un identifiant unique à 14 chiffres attribué par l'INSEE à chaque établissement d'une entreprise en France. Il se compose du SIREN (9 chiffres, identifiant de l'entreprise juridique) suivi d'un NIC (Numéro Interne de Classement, 5 chiffres) propre à l'établissement. Une entreprise peut donc avoir plusieurs SIRET (un siège et des établissements secondaires) mais un seul SIREN.

Dans le contexte de la facturation électronique, le SIRET est l'identifiant privilégié pour le **routage** dans l'Annuaire central : il permet de distinguer les établissements d'un même groupe afin d'adresser la bonne facture à la bonne unité opérationnelle (par exemple, un magasin spécifique d'une enseigne nationale). Il est également l'identifiant historiquement utilisé dans Chorus Pro pour le B2G.

Les factures électroniques conformes à la CIUS FR doivent mentionner le SIRET de l'émetteur et, selon les cas, celui du destinataire dans les champs BT-30 (identifiant du vendeur) et BT-46 (identifiant de l'acheteur) ou dans des extensions de routage. Le contrôle de la clé de Luhn (algorithme de validation des 14 chiffres) est généralement effectué par les PA lors du dépôt afin de détecter les erreurs de saisie. Un SIRET non actif (établissement fermé) peut entraîner un rejet.
