import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Bar = {
  label: string;
  value: number;
  max: number;
  sub: string;
  color: string;
};

const BARS: Bar[] = [
  {
    label: "Amende unitaire e-invoicing",
    value: 15,
    max: 250,
    sub: "15 € par facture non conforme",
    color: "#0369A1",
  },
  {
    label: "Amende unitaire e-reporting",
    value: 250,
    max: 250,
    sub: "250 € par transmission manquante",
    color: "#0369A1",
  },
  {
    label: "Plafond annuel e-invoicing",
    value: 15000,
    max: 60000,
    sub: "15 000 € / an / entreprise",
    color: "#0F172A",
  },
  {
    label: "Plafond annuel e-reporting",
    value: 45000,
    max: 60000,
    sub: "45 000 € / an / entreprise",
    color: "#0F172A",
  },
  {
    label: "Plafonds cumulés",
    value: 60000,
    max: 60000,
    sub: "Jusqu'à 60 000 € / an",
    color: "#B91C1C",
  },
];

export default function SanctionsChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  return (
    <div
      ref={ref}
      className="not-prose my-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
      aria-label="Barème des sanctions"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
        Barème des sanctions (CGI art. 1737)
      </p>
      <div className="mt-4 space-y-3">
        {BARS.map((b, i) => {
          const pct = (b.value / b.max) * 100;
          return (
            <div key={b.label}>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-medium text-[var(--color-primary)]">{b.label}</span>
                <span className="tabular-nums font-semibold text-[var(--color-primary)]">
                  {b.value.toLocaleString("fr-FR")} €
                </span>
              </div>
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-[var(--color-muted)]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: b.color }}
                  initial={{ width: reduce ? `${pct}%` : 0 }}
                  animate={inView ? { width: `${pct}%` } : {}}
                  transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.1 * i, ease: "easeOut" }}
                />
              </div>
              <p className="mt-1 text-[11px] text-[var(--color-muted-foreground)]">{b.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
