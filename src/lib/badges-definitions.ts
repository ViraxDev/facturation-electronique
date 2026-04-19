export type BadgeDef = {
  id: string;
  label: string;
  description: string;
  icon: string;
  category: "parcours" | "quiz" | "exploration" | "outils" | "milestone";
};

export const BADGES: readonly BadgeDef[] = [
  { id: "premier-module", label: "Premier pas", description: "Valider votre premier module.", icon: "Sparkles", category: "milestone" },
  { id: "parcours-fondations", label: "Fondations maîtrisées", description: "Compléter le parcours Fondations légales.", icon: "Scale", category: "parcours" },
  { id: "parcours-ecosysteme", label: "Connaisseur de l'écosystème", description: "Compléter le parcours Écosystème.", icon: "Network", category: "parcours" },
  { id: "parcours-technique", label: "Technicien Factur-X", description: "Compléter le parcours Technique.", icon: "Code2", category: "parcours" },
  { id: "parcours-e-reporting", label: "Expert e-reporting", description: "Compléter le parcours E-reporting.", icon: "BarChart3", category: "parcours" },
  { id: "parcours-business", label: "Vendeur aguerri", description: "Compléter le parcours Business.", icon: "Briefcase", category: "parcours" },
  { id: "tous-parcours", label: "Tour de France", description: "Compléter les 5 parcours.", icon: "Trophy", category: "milestone" },
  { id: "quiz-parfait", label: "Sans faute", description: "Réussir un quiz avec 100 %.", icon: "Target", category: "quiz" },
  { id: "dix-quiz-parfaits", label: "Décuple", description: "Réussir 10 quiz avec 100 %.", icon: "Medal", category: "quiz" },
  { id: "lecteur-assidu", label: "Lecteur assidu", description: "Lire 10 modules.", icon: "BookOpen", category: "milestone" },
  { id: "bibliothecaire", label: "Bibliothécaire", description: "Consulter 20 termes du lexique.", icon: "Library", category: "exploration" },
  { id: "veilleur", label: "Veilleur", description: "Explorer la timeline de veille.", icon: "Eye", category: "exploration" },
  { id: "maitre-facturx", label: "Maître Factur-X", description: "Utiliser le visualiseur Factur-X.", icon: "FileCode2", category: "outils" },
  { id: "architecte-roi", label: "Architecte ROI", description: "Utiliser le calculateur ROI cabinet.", icon: "Calculator", category: "outils" },
  { id: "eligibilite-expert", label: "Expert éligibilité", description: "Utiliser le simulateur d'éligibilité.", icon: "CheckCircle2", category: "outils" },
  { id: "comparateur-pa", label: "Chasseur de PA", description: "Utiliser le comparateur de plateformes.", icon: "Scale3d", category: "outils" },
  { id: "premier-essai", label: "Premier essai", description: "Valider un quiz sans erreur au premier essai.", icon: "Zap", category: "quiz" },
  { id: "explorateur", label: "Explorateur", description: "Visiter chaque outil interactif au moins une fois.", icon: "Compass", category: "exploration" },
];

export const BADGE_MAP = Object.fromEntries(BADGES.map((b) => [b.id, b]));
