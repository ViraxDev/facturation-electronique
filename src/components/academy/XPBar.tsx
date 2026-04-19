import { useStore } from "@nanostores/react";
import { progression, level, levelProgress } from "@/stores/progression";
import { Sparkles } from "lucide-react";

export default function XPBar() {
  const p = useStore(progression);
  const lvl = useStore(level);
  const pr = useStore(levelProgress);
  const pct = Math.round(pr * 100);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 shadow-sm">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 text-white">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-[var(--color-primary)]">{lvl.label}</span>
          <span className="tabular text-[var(--color-muted-foreground)]">{p.xp.toLocaleString("fr-FR")} XP</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label={`Progression niveau ${lvl.label}`}
          className="mt-1 h-2 rounded-full bg-[var(--color-muted)] overflow-hidden"
        >
          <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-[width] duration-300 ease-out" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
