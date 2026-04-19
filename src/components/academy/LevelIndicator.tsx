import { useStore } from "@nanostores/react";
import { progression, level, levelProgress } from "@/stores/progression";
import { LEVELS } from "@/lib/xp-rules";

export default function LevelIndicator() {
  const p = useStore(progression);
  const lvl = useStore(level);
  const pr = useStore(levelProgress);
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-primary)]">Niveau : {lvl.label}</h3>
        <span className="text-sm tabular text-[var(--color-muted-foreground)]">{p.xp.toLocaleString("fr-FR")} XP</span>
      </div>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pr * 100)} className="mt-3 h-2 rounded-full bg-[var(--color-muted)] overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-[width] duration-500" style={{ width: `${pr * 100}%` }} />
      </div>
      <ol className="mt-4 grid grid-cols-5 gap-2 text-[10px] text-center">
        {LEVELS.map((l) => (
          <li key={l.label} className={`rounded-md px-1 py-1 ${l.label === lvl.label ? "bg-amber-100 text-amber-900 font-semibold" : "text-[var(--color-muted-foreground)]"}`}>{l.label}</li>
        ))}
      </ol>
    </div>
  );
}
