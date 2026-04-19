---
terme: "API REST"
categorie: "Technique"
voir_aussi: ["webhook", "xml", "plateforme-agreee"]
---

Une **API REST** (Representational State Transfer) est une interface de programmation applicative qui respecte les principes architecturaux définis par Roy Fielding (2000) : ressources identifiées par des URL, verbes HTTP standard (GET, POST, PUT, DELETE), représentations en JSON ou XML, stateless, mise en cache. REST est devenu le paradigme dominant pour l'intégration B2B moderne.

Dans l'écosystème e-invoicing, les **API REST des Plateformes Agréées** constituent l'interface principale entre l'ERP de l'entreprise et la PA. Elles permettent d'émettre une facture (`POST /invoices`), de consulter un statut (`GET /invoices/{id}/status`), de récupérer les factures entrantes (`GET /inbox`), de mettre à jour les statuts métier (`PUT /invoices/{id}/status`), de gérer les contacts et le routage annuaire.

L'authentification s'appuie classiquement sur OAuth 2.0 (client credentials pour machine-to-machine), JWT et certificats mTLS pour les flux critiques. Les PA respectent généralement les bonnes pratiques modernes : pagination, versioning (v1, v2), idempotence via des clés de requête, documentation OpenAPI/Swagger, sandbox de pré-production. Les éditeurs d'ERP développent un connecteur par PA cible, avec un effort d'intégration allant de quelques jours à plusieurs semaines selon la complexité. L'API REST est complétée par des webhooks pour les notifications asynchrones (changement de statut, nouvelle facture reçue).
