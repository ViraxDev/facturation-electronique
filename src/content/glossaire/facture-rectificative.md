---
terme: "Facture rectificative (avoir)"
categorie: "Concept"
voir_aussi: ["cycle-de-vie-facture", "mentions-obligatoires", "tva"]
---

Une **facture rectificative**, communément appelée **avoir** ou **note de crédit**, est un document comptable émis pour corriger, annuler ou réduire une facture précédemment émise. Elle est encadrée par l'article 272 du CGI et doit obligatoirement faire référence à la facture d'origine qu'elle corrige (numéro, date, montant). Elle peut porter sur un trop-facturé, un retour de marchandise, une remise commerciale a posteriori, un litige ou une annulation totale.

En facturation électronique, l'avoir suit le même circuit que la facture initiale : émission via la PA, transmission au destinataire, mise à jour des statuts. La norme EN 16931 distingue deux codes de type de document (BT-3 = invoice type code) : **380** pour la facture classique et **381** pour l'avoir (credit note). Les montants sont exprimés en valeurs positives dans le XML, le code de type indiquant le sens de l'opération (à la différence des systèmes anciens où l'on inscrivait des montants négatifs).

L'avoir doit reprendre les mentions obligatoires d'une facture et porter un numéro séquentiel unique propre, distinct de la série des factures (recommandation). Il impacte la déclaration de TVA sur la période d'émission : la TVA est régularisée (restituée à l'acheteur, reversée par le vendeur) dans la déclaration du mois ou du trimestre concerné. Les PA traitent les avoirs exactement comme les factures dans leurs flux et statuts.
