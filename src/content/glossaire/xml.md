---
terme: "XML"
categorie: "Technique"
voir_aussi: ["ubl-2-1", "un-cefact-cii", "api-rest"]
---

**XML** (eXtensible Markup Language) est un langage de balisage extensible normalisé par le W3C en 1998, conçu pour structurer, stocker et transporter des données de manière indépendante des plateformes et des logiciels. Il constitue le socle technique de la facture électronique structurée : UBL 2.1, UN/CEFACT CII et le composant structuré de Factur-X sont tous des dialectes XML.

La force de XML tient à la séparation stricte entre structure (schéma XSD), contenu (instance) et présentation (XSLT). Les schémas XSD définissent les types, cardinalités et contraintes ; les schematrons (règles en XPath) expriment les règles métier (par exemple : si BT-8 est « S » alors BT-96 est obligatoire). Cette rigueur permet une validation syntaxique et sémantique automatisée avant envoi, condition sine qua non pour éviter les rejets par les PA.

Dans la pratique, les éditeurs génèrent le XML à partir des données de l'ERP, le valident contre le schéma EN 16931 et les règles CIUS FR, puis le transmettent via l'API de la PA. Côté réception, le XML est parsé pour alimenter la comptabilité fournisseur. XML reste largement utilisé malgré la montée de JSON, car la facturation électronique repose sur des normes ISO/CEN établies depuis plus d'une décennie en XML.
