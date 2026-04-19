import { useStore } from "@nanostores/react";
import { progression } from "@/stores/progression";
import ProgressRing from "./ProgressRing";

const PARCOURS_META: { id: string; prefix: string; label: string; total: number }[] = [
  { id: "fondations", prefix: "p1", label: "Fondations", total: 5 },
  { id: "ecosysteme", prefix: "p2", label: "Écosystème", total: 7 },
  { id: "technique", prefix: "p3", label: "Technique", total: 9 },
  { id: "e-reporting", prefix: "p4", label: "E-reporting", total: 6 },
  { id: "business", prefix: "p5", label: "Business", total: 3 },
];

export default function ParcoursProgress() {
  const p = useStore(progression);
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {PARCOURS_META.map((pc) => {
        const done = p.modulesCompleted.filter((m) => m.startsWith(pc.prefix + "-")).length;
        return (
          <li key={pc.id} className="flex flex-col items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <ProgressRing value={done / pc.total} size={72} stroke={6} />
            <div className="mt-2 text-sm font-semibold text-center">{pc.label}</div>
            <div className="text-xs tabular text-[var(--color-muted-foreground)]">{done} / {pc.total}</div>
          </li>
        );
      })}
    </ul>
  );
}
