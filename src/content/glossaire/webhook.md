---
terme: "Webhook"
categorie: "Technique"
voir_aussi: ["api-rest", "statut-14-statuts", "plateforme-agreee"]
---

Un **webhook** (ou HTTP callback) est un mécanisme d'intégration inverse dans lequel un système tiers notifie activement une application cliente lorsqu'un événement se produit, en envoyant une requête HTTP POST à une URL préalablement enregistrée. Contrairement au polling d'une API REST (qui requiert des appels réguliers), le webhook est poussé (push) : il est plus économe en ressources et quasi temps réel.

Dans l'écosystème e-invoicing, les **webhooks des Plateformes Agréées** sont utilisés pour notifier l'ERP de l'entreprise des événements clés : facture reçue, changement de statut du cycle de vie (Déposée → Mise en paiement → Encaissée), rejet, refus, nouvel avoir. L'ERP peut ainsi mettre à jour sa base de données immédiatement et déclencher des workflows (rapprochement, validation, écriture comptable).

La sécurisation des webhooks repose sur plusieurs mécanismes : signature HMAC du payload avec un secret partagé (pour vérifier l'origine), IP whitelisting, mTLS, idempotence via un ID d'événement. La gestion des rejeux est critique : si l'ERP est indisponible, la PA doit retenter avec un backoff exponentiel pendant plusieurs heures ou jours, pour éviter toute perte d'événement. Les bonnes pratiques recommandent de découpler la réception (file d'attente, 200 OK immédiat) du traitement applicatif pour absorber les pics de charge et fiabiliser le pipeline global.
