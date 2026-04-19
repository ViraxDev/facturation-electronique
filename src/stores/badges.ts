import { computed } from "nanostores";
import { progression } from "./progression";
import { BADGES } from "@/lib/badges-definitions";

export const unlockedBadges = computed(progression, (p) => {
  const unlocked = new Set<string>();

  if (p.modulesCompleted.length >= 1) unlocked.add("premier-module");
  if (p.modulesCompleted.length >= 10) unlocked.add("lecteur-assidu");

  const slugToParcours: Record<string, string> = {
    p1: "fondations",
    p2: "ecosysteme",
    p3: "technique",
    p4: "e-reporting",
    p5: "business",
  };
  const byParcours: Record<string, number> = {};
  for (const m of p.modulesCompleted) {
    const key = slugToParcours[m.split("-")[0]];
    if (key) byParcours[key] = (byParcours[key] ?? 0) + 1;
  }

  const expected: Record<string, number> = {
    fondations: 5,
    ecosysteme: 7,
    technique: 9,
    "e-reporting": 6,
    business: 3,
  };
  const map: Record<string, string> = {
    fondations: "parcours-fondations",
    ecosysteme: "parcours-ecosysteme",
    technique: "parcours-technique",
    "e-reporting": "parcours-e-reporting",
    business: "parcours-business",
  };
  let allFive = true;
  for (const [k, want] of Object.entries(expected)) {
    if ((byParcours[k] ?? 0) >= want) unlocked.add(map[k]);
    else allFive = false;
  }
  if (allFive) unlocked.add("tous-parcours");

  const perfectQuizzes = Object.values(p.quizScores).filter((q) => q.correct === q.total);
  if (perfectQuizzes.length >= 1) unlocked.add("quiz-parfait");
  if (perfectQuizzes.length >= 10) unlocked.add("dix-quiz-parfaits");
  if (perfectQuizzes.some((q) => q.firstTry)) unlocked.add("premier-essai");

  if (p.lexiqueVus.length >= 20) unlocked.add("bibliothecaire");
  if (p.veilleVue) unlocked.add("veilleur");

  if (p.toolsUsed.includes("factur-x-viewer")) unlocked.add("maitre-facturx");
  if (p.toolsUsed.includes("roi-cabinet")) unlocked.add("architecte-roi");
  if (p.toolsUsed.includes("eligibilite")) unlocked.add("eligibilite-expert");
  if (p.toolsUsed.includes("comparateur-pa")) unlocked.add("comparateur-pa");
  if (["factur-x-viewer", "roi-cabinet", "eligibilite", "comparateur-pa"].every((t) => p.toolsUsed.includes(t))) {
    unlocked.add("explorateur");
  }

  return BADGES.map((b) => ({ ...b, unlocked: unlocked.has(b.id) }));
});
