---
terme: "Cachet serveur"
categorie: "Technique"
voir_aussi: ["signature-electronique", "plateforme-agreee", "piste-d-audit-fiable"]
---

Le **cachet serveur** (ou cachet électronique, electronic seal en anglais) est un dispositif cryptographique défini par le règlement eIDAS qui permet à une personne morale de garantir l'origine et l'intégrité d'un document ou d'un lot de documents, sans nécessité d'identifier une personne physique signataire. Contrairement à la signature électronique qui engage un individu, le cachet engage l'organisation émettrice.

Dans l'écosystème e-invoicing, le cachet serveur est massivement utilisé par les Plateformes Agréées pour sceller les flux sortants : chaque facture transmise entre PA, ou de la PA vers le PPF, est cachetée afin que le destinataire (autre PA, administration, destinataire final) puisse vérifier la provenance et détecter toute altération en transit. Le cachet s'appuie sur un certificat X.509 émis par un prestataire de services de confiance qualifié (PSCo).

Trois niveaux existent : cachet simple, avancé et qualifié (eIDAS-Q). Le niveau qualifié offre la plus forte valeur probante et est généralement exigé pour les usages réglementaires. Le cachet serveur est également utile pour les horodatages, les accusés de réception, les statuts du cycle de vie et l'archivage à valeur probante. Il se distingue du TLS (qui sécurise le canal de transport) en ce qu'il reste attaché au document, même après transmission et stockage.
