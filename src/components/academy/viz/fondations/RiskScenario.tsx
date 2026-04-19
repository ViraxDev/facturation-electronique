import { useState, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Shield, AlertTriangle } from "lucide-react";

const COSTS = [
  { label: "Amende e-invoicing (plafonnée)", value: 15000 },
  { label: "Amende e-reporting (théorique)", value: 45000 },
  { label: "TVA déductible rejetée côté clients", value: 80000 },
  { label: "Régularisation d'urgence", value: 10000 },
];

const PREVENTION = 3000;

export default function RiskScenario() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const total = COSTS.reduce((s, c) => s + c.value, 0);
  const ratio = Math.round(total / PREVENTION);
  const max = total;

  return (
    <div
      ref={ref}
      className="not-prose my-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
        Scénario d'une PME non conforme (1 500 factures / an)
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[#0369A1]/30 bg-[#0369A1]/5 p-4">
          <div className="flex items-center gap-2 text-[#0369A1]">
            <Shield className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide">Prévention</span>
          </div>
          <div className="mt-2 text-2xl font-semibold text-[var(--color-primary)] tabular-nums">
            {PREVENTION.toLocaleString("fr-FR")} €
          </div>
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">Accompagnement cabinet anticipé</p>
        </div>

        <div className="rounded-lg border border-[#B91C1C]/30 bg-[#B91C1C]/5 p-4">
          <div className="flex items-center gap-2 text-[#B91C1C]">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide">Exposition</span>
          </div>
          <motion.div
            className="mt-2 text-2xl font-semibold text-[var(--color-primary)] tabular-nums"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
          >
            {total.toLocaleString("fr-FR")} €
          </motion.div>
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            Soit x{ratio} le coût de la prévention
          </p>
        </div>
      </div>

      <button
        onClick={() => setShow((s) => !s)}
        className="mt-4 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] hover:border-[#0369A1]"
      >
        {show ? "Masquer le détail" : "Afficher le détail"}
      </button>

      {show && (
        <motion.ul
          initial={reduce ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-3 space-y-2 overflow-hidden"
        >
          {COSTS.map((c, i) => {
            const pct = (c.value / max) * 100;
            return (
              <li key={c.label}>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-[var(--color-primary)]">{c.label}</span>
                  <span className="tabular-nums font-semibold text-[var(--color-primary)]">
                    {c.value.toLocaleString("fr-FR")} €
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--color-muted)]">
                  <motion.div
                    className="h-full bg-[#B91C1C]/70"
                    initial={{ width: reduce ? `${pct}%` : 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.05 * i }}
                  />
                </div>
              </li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}
