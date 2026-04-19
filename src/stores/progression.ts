import { persistentAtom } from "@nanostores/persistent";
import { computed } from "nanostores";
import { levelForXP, progressWithinLevel, XP_MODULE_DEFAULT, XP_QUIZ_PERFECT_BONUS, XP_TOOL_USE } from "@/lib/xp-rules";

export type Progression = {
  xp: number;
  modulesCompleted: string[];
  quizScores: Record<string, { correct: number; total: number; firstTry: boolean }>;
  toolsUsed: string[];
  lexiqueVus: string[];
  veilleVue: boolean;
  updatedAt: string;
};

const empty: Progression = {
  xp: 0,
  modulesCompleted: [],
  quizScores: {},
  toolsUsed: [],
  lexiqueVus: [],
  veilleVue: false,
  updatedAt: new Date(0).toISOString(),
};

export const progression = persistentAtom<Progression>("fe:progression", empty, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const level = computed(progression, (p) => levelForXP(p.xp));
export const levelProgress = computed(progression, (p) => progressWithinLevel(p.xp));

function touch(next: Progression) {
  return { ...next, updatedAt: new Date().toISOString() };
}

export function completeModule(slug: string, xp = XP_MODULE_DEFAULT) {
  const cur = progression.get();
  if (cur.modulesCompleted.includes(slug)) return;
  progression.set(touch({ ...cur, modulesCompleted: [...cur.modulesCompleted, slug], xp: cur.xp + xp }));
}

export function recordQuiz(slug: string, correct: number, total: number, firstTry: boolean) {
  const cur = progression.get();
  const prev = cur.quizScores[slug];
  const wasPerfect = prev?.correct === prev?.total;
  const nowPerfect = correct === total;
  const bonus = nowPerfect && !wasPerfect ? XP_QUIZ_PERFECT_BONUS : 0;
  progression.set(touch({
    ...cur,
    quizScores: { ...cur.quizScores, [slug]: { correct, total, firstTry } },
    xp: cur.xp + bonus,
  }));
}

export function markToolUsed(toolId: string) {
  const cur = progression.get();
  if (cur.toolsUsed.includes(toolId)) return;
  progression.set(touch({ ...cur, toolsUsed: [...cur.toolsUsed, toolId], xp: cur.xp + XP_TOOL_USE }));
}

export function markLexique(slug: string) {
  const cur = progression.get();
  if (cur.lexiqueVus.includes(slug)) return;
  progression.set(touch({ ...cur, lexiqueVus: [...cur.lexiqueVus, slug] }));
}

export function markVeilleVue() {
  const cur = progression.get();
  if (cur.veilleVue) return;
  progression.set(touch({ ...cur, veilleVue: true }));
}

export function resetProgression() {
  progression.set(touch(empty));
}

export function exportProgression(): string {
  return JSON.stringify(progression.get(), null, 2);
}

export function importProgression(json: string) {
  const parsed = JSON.parse(json) as Progression;
  progression.set(touch(parsed));
}
