import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, CheckCircle2 } from "lucide-react";

// Milestones positioned on a 2024-01 → 2028-01 axis.
const START = new Date("2024-01-01").getTime();
const END = new Date("2028-01-01").getTime();

type Milestone = {
  date: string;
  label: string;
  short: string;
  detail: string;
};

const MS: Milestone[] = [
  {
    date: "2024-01-15",
    label: "Loi de finances 2024",
    short: "LF 2024",
    detail: "Le calendrier est officialisé : bascule décalée à 2026-2027 (article 91).",
  },
  {
    date: "2025-01-01",
    label: "Phase préparation",
    short: "Audit cabinets",
    detail: "Audit du parc clients, classement LME, choix d'une ou plusieurs PA.",
  },
  {
    date: "2026-09-01",
    label: "Réception universelle + émission GE/ETI",
    short: "1er sept. 2026",
    detail:
      "Toutes les entreprises assujetties à la TVA doivent pouvoir recevoir. Les GE et ETI basculent en émission.",
  },
  {
    date: "2027-09-01",
    label: "Émission PME / TPE / micro",
    short: "1er sept. 2027",
    detail: "L'obligation d'émission s'étend aux PME, TPE et micro-entreprises. Le B2B domestique est 100% électronique.",
  },
];

function pct(iso: string) {
  const t = new Date(iso).getTime();
  return Math.max(0, Math.min(1, (t - START) / (END - START))) * 100;
}

export default function Timeline() {
  const [idx, setIdx] = useState(2);
  const reduce = useReducedMotion();
  const current = MS[idx];
  const cursorPct = useMemo(() => pct(current.date), [current.date]);

  return (
    <div className="not-prose my-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
      <div className="flex items-center gap-2 text-[#0369A1]">
        <Calendar className="h-4 w-4" aria-hidden="true" />
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
          Calendrier 2024 → 2027
        </p>
      </div>

      <div className="relative mt-6 h-16">
        <div className="absolute left-0 right-0 top-6 h-1 rounded-full bg-[var(--color-muted)]" />
        <motion.div
          className="absolute left-0 top-6 h-1 rounded-full bg-[#0369A1]"
          initial={false}
          animate={{ width: `${cursorPct}%` }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
        />

        {["2024", "2025", "2026", "2027", "2028"].map((y, i) => (
          <span
            key={y}
            className="absolute -translate-x-1/2 text-[10px] font-medium text-[var(--color-muted-foreground)]"
            style={{ left: `${(i / 4) * 100}%`, top: 0 }}
          >
            {y}
          </span>
        ))}

        {MS.map((m, i) => {
          const p = pct(m.date);
          const isActive = i === idx;
          return (
            <button
              key={m.date}
              onClick={() => setIdx(i)}
              aria-label={`Jalon ${m.label}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
              style={{ left: `${p}%`, top: "1.5rem" }}
            >
              <motion.span
                animate={{ scale: isActive ? 1.25 : 1 }}
                transition={{ duration: 0.2 }}
                className={`block h-4 w-4 rounded-full border-2 ${
                  isActive
                    ? "border-[#0369A1] bg-white shadow-md"
                    : "border-[var(--color-border)] bg-white"
                }`}
              />
              <span
                className={`absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium ${
                  isActive ? "text-[#0369A1]" : "text-[var(--color-muted-foreground)]"
                }`}
              >
                {m.short}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={current.date}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6 rounded-lg border border-[#0369A1]/20 bg-[#0369A1]/5 p-3"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#0369A1]" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-[var(--color-primary)]">{current.label}</h4>
        </div>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{current.detail}</p>
      </motion.div>

      <div className="mt-3 flex flex-wrap gap-2">
        {MS.map((m, i) => (
          <button
            key={m.date}
            onClick={() => setIdx(i)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              i === idx
                ? "border-[#0369A1] bg-[#0369A1] text-white"
                : "border-[var(--color-border)] text-[var(--color-primary)] hover:border-[#0369A1]"
            }`}
          >
            {m.short}
          </button>
        ))}
      </div>
    </div>
  );
}
