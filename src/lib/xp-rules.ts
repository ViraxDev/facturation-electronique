export const LEVELS = [
  { id: "novice", label: "Novice", min: 0, max: 500 },
  { id: "apprenti", label: "Apprenti", min: 501, max: 1500 },
  { id: "praticien", label: "Praticien", min: 1501, max: 3500 },
  { id: "expert", label: "Expert", min: 3501, max: 6500 },
  { id: "maitre", label: "Maître", min: 6501, max: Infinity },
] as const;

export function levelForXP(xp: number) {
  return LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[0];
}

export function progressWithinLevel(xp: number) {
  const lvl = levelForXP(xp);
  if (lvl.max === Infinity) return 1;
  return (xp - lvl.min) / (lvl.max - lvl.min);
}

export const XP_MODULE_DEFAULT = 100;
export const XP_QUIZ_PERFECT_BONUS = 50;
export const XP_TOOL_USE = 30;
