import { useStore } from "@nanostores/react";
import { unlockedBadges } from "@/stores/badges";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function BadgeGrid() {
  const badges = useStore(unlockedBadges);
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {badges.map((b) => {
        const Icon = ((Icons as unknown) as Record<string, LucideIcon>)[b.icon] ?? Icons.Award;
        return (
          <li key={b.id} className={`rounded-xl border p-3 text-center transition-opacity ${b.unlocked ? "border-amber-300 bg-amber-50" : "border-[var(--color-border)] bg-[var(--color-card)] opacity-50"}`} aria-label={`${b.label}${b.unlocked ? " débloqué" : " verrouillé"}`}>
            <div className={`mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full ${b.unlocked ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white" : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="mt-2 text-xs font-semibold">{b.label}</div>
            <div className="mt-0.5 text-[10px] text-[var(--color-muted-foreground)] line-clamp-2">{b.description}</div>
          </li>
        );
      })}
    </ul>
  );
}
